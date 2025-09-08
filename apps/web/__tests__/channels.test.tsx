import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

// Mock next-auth/react before importing the component that uses it
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock next/navigation before importing the component that uses it
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Explicitly mock @/lib/trpc before importing it
jest.doMock('@/lib/trpc', () => ({
  api: {
    channel: {
      getSubscriptions: {
        useQuery: jest.fn(),
      },
      saveSelectedChannels: {
        useMutation: jest.fn(),
      },
    },
  },
}));

// Import api after it has been mocked
const { api } = require('@/lib/trpc');

import ChannelsPage from '../src/app/channels/page';
import ChannelToggle from '../src/components/custom/ChannelToggle';
import { useSession } from 'next-auth/react'; // Import useSession after mocking

const mockUseRouter = useRouter as jest.Mock;
const mockUseQuery = api.channel.getSubscriptions.useQuery as jest.Mock;
const mockUseMutation = api.channel.saveSelectedChannels.useMutation as jest.Mock;


describe('ChannelToggle', () => {
  it('renders correctly with initial state', () => {
    render(
      <ChannelToggle channelId="test-channel" initialState={false} onToggle={jest.fn()} />
    );
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('toggles state on click', () => {
    const onToggleMock = jest.fn();
    render(
      <ChannelToggle channelId="test-channel" initialState={false} onToggle={onToggleMock} />
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(onToggleMock).toHaveBeenCalledWith('test-channel', true);
  });
});

describe('ChannelsPage', () => {
  beforeEach(() => {
    (useSession as jest.Mock) = jest.fn();
    (useRouter as jest.Mock) = jest.fn();

    (useSession as jest.Mock).mockReturnValue({ data: { user: { name: 'Test User' } }, status: 'authenticated' });
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    mockUseQuery.mockReturnValue({
      data: [
        { id: '1', channelId: 'UC1', name: 'Channel A', thumbnailUrl: 'urlA' },
        { id: '2', channelId: 'UC2', name: 'Channel B', thumbnailUrl: 'urlB' },
      ],
      isLoading: false,
      error: null,
    });
    mockUseMutation.mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
  });

  it('renders loading state', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null, status: 'loading' });
    render(<ChannelsPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects unauthenticated users', () => {
    const pushMock = jest.fn();
    (useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    render(<ChannelsPage />);
    expect(screen.getByText('Redirecting...')).toBeInTheDocument();
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('displays channels and allows selection', async () => {
    render(<ChannelsPage />);
    expect(screen.getByText('Channel A')).toBeInTheDocument();
    expect(screen.getByText('Channel B')).toBeInTheDocument();

    const channelAToggle = screen.getByLabelText('Channel A'); // Assuming label is associated
    fireEvent.click(channelAToggle);
    await waitFor(() => expect(channelAToggle).toBeChecked());
  });

  it('saves selected channels', async () => {
    const mutateMock = jest.fn();
    mockUseMutation.mockReturnValue({
      mutate: mutateMock,
      isLoading: false,
      isError: false,
      isSuccess: false,
    });

    render(<ChannelsPage />);

    const channelAToggle = screen.getByLabelText('Channel A');
    fireEvent.click(channelAToggle);

    const saveButton = screen.getByRole('button', { name: /Save Selected Channels/i });
    fireEvent.click(saveButton);

    await waitFor(() => expect(mutateMock).toHaveBeenCalledWith(['1']));
  });
});
