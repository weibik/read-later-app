import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagFilter from './TagFilter';

describe('TagFilter', () => {
  it('renders all plus one chip per tag', () => {
    const onSelect = vi.fn();
    render(
      <TagFilter
        tags={['react', 'docs']}
        selected={null}
        onSelect={onSelect}
      />,
    );
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('docs')).toBeInTheDocument();
  });

  it('calls onSelect with the tag when a chip is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <TagFilter
        tags={['react', 'docs']}
        selected={null}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'react' }));

    expect(onSelect).toHaveBeenCalledWith('react');
  });

  it('calls onSelect(null) when All is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <TagFilter tags={['react']} selected={'react'} onSelect={onSelect} />,
    );

    await user.click(screen.getByRole('button', { name: 'All' }));

    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it('marks only the selected chip as pressed', () => {
    render(
      <TagFilter
        tags={['react', 'docs']}
        selected="react"
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'react' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'docs' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
