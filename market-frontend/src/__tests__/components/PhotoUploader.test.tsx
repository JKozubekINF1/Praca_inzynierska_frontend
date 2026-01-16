import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PhotoUploader } from '../../components/add-announcement/PhotoUploader';

global.URL.createObjectURL = vi.fn(() => 'mock-url');

describe('PhotoUploader', () => {
  const mockOnChange = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderuje stan pusty', () => {
    render(<PhotoUploader photos={[]} onChange={mockOnChange} onRemove={mockOnRemove} />);

    expect(screen.getByText('Kliknij, aby dodać zdjęcia')).toBeInTheDocument();
    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
  });

  it('wyświetla podgląd zdjęć', () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    render(<PhotoUploader photos={[file]} onChange={mockOnChange} onRemove={mockOnRemove} />);

    expect(screen.getByAltText('Preview')).toBeInTheDocument();
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
  });

  it('wywołuje onChange przy dodawaniu pliku', () => {
    render(<PhotoUploader photos={[]} onChange={mockOnChange} onRemove={mockOnRemove} />);
    const container = screen.getByText('Kliknij, aby dodać zdjęcia').closest('div')?.parentElement;
    const input = container?.querySelector('input[type="file"]');

    expect(input).toBeDefined();

    if (input) {
      const file = new File(['hello'], 'hello.png', { type: 'image/png' });
      fireEvent.change(input, { target: { files: [file] } });
      expect(mockOnChange).toHaveBeenCalled();
    }
  });

  it('wywołuje onRemove przy kliknięciu usuń', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    render(<PhotoUploader photos={[file]} onChange={mockOnChange} onRemove={mockOnRemove} />);

    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith(0);
  });
});
