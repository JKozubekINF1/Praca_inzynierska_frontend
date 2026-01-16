import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchFilters } from '../../components/search/SearchFilters';

describe('SearchFilters', () => {
  const mockOnChange = vi.fn();
  const mockOnSearch = vi.fn();

  const defaultFilters = {
    query: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
  };

  it('renderuje podstawowe filtry', () => {
    render(
      <SearchFilters
        filters={defaultFilters}
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        loading={false}
      />
    );

    expect(screen.getByText('Szukana fraza')).toBeInTheDocument();
    expect(screen.getByText('Kategoria')).toBeInTheDocument();
    expect(screen.getByText('Cena (PLN)')).toBeInTheDocument();
    expect(screen.queryByText('Szczegóły pojazdu')).not.toBeInTheDocument();
  });

  it('pokazuje filtry pojazdu po wybraniu kategorii Pojazd', () => {
    render(
      <SearchFilters
        filters={{ ...defaultFilters, category: 'Pojazd' }}
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        loading={false}
      />
    );

    expect(screen.getByText('Szczegóły pojazdu')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Marka')).toBeInTheDocument();
    expect(screen.getByText('Paliwo')).toBeInTheDocument();
  });

  it('pokazuje filtry części po wybraniu kategorii Część', () => {
    render(
      <SearchFilters
        filters={{ ...defaultFilters, category: 'Część' }}
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        loading={false}
      />
    );

    expect(screen.getByText('Szczegóły części')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('np. 1J0 907 503')).toBeInTheDocument();
  });

  it('wywołuje onChange przy wpisywaniu', () => {
    render(
      <SearchFilters
        filters={defaultFilters}
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        loading={false}
      />
    );

    const input = screen.getByPlaceholderText('np. Audi A4, Alternator...');
    fireEvent.change(input, { target: { name: 'query', value: 'Audi' } });

    expect(mockOnChange).toHaveBeenCalledWith('query', 'Audi');
  });

  it('wywołuje onSearch przy kliknięciu przycisku', () => {
    render(
      <SearchFilters
        filters={defaultFilters}
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        loading={false}
      />
    );

    fireEvent.click(screen.getByText('Pokaż wyniki'));
    expect(mockOnSearch).toHaveBeenCalled();
  });
});
