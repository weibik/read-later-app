import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddForm from './AddForm';

describe('AddForm', () => {
  it('calls onAdd with the url when the url is valid', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddForm onAdd={onAdd} />);

    await user.type(
      screen.getByRole('textbox', { name: 'URL to save' }),
      'https://example.com',
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onAdd).toHaveBeenCalledWith('https://example.com', []);
  });

  it('shows an error and does not call onAdd for an invalid url', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddForm onAdd={onAdd} />);

    await user.type(
      screen.getByRole('textbox', { name: 'URL to save' }),
      'fps://example.com',
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByText('Enter a valid URL.')).toBeInTheDocument();
  });

  it('rejects more than five tags', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddForm onAdd={onAdd} />);

    await user.type(
      screen.getByRole('textbox', { name: 'URL to save' }),
      'https://example.com',
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Tags, separated by commas' }),
      'a, b, c, d, e, f',
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByText('Use up to 5 tags.')).toBeInTheDocument();
  });

  it('acceps less than six tags', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddForm onAdd={onAdd} />);

    await user.type(
      screen.getByRole('textbox', { name: 'URL to save' }),
      'https://example.com',
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Tags, separated by commas' }),
      'a, b, c, d, e',
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onAdd).toHaveBeenCalled();
    expect(onAdd).toHaveBeenCalledWith('https://example.com', [
      'a',
      'b',
      'c',
      'd',
      'e',
    ]);
  });

  it('splits tags on commas and drops empty ones', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddForm onAdd={onAdd} />);

    await user.type(
      screen.getByRole('textbox', { name: 'URL to save' }),
      'https://example.com',
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Tags, separated by commas' }),
      'react,  , docs,',
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onAdd).toHaveBeenCalledWith('https://example.com', [
      'react',
      'docs',
    ]);
  });
});
