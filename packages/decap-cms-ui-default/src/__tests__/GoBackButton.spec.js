import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropTypes from 'prop-types';
import GoBackButton from '../GoBackButton';

jest.mock('../Icon', () => {
  return function MockIcon({ type, size }) {
    return <span data-testid="icon" data-type={type} data-size={size} />;
  };
});

describe('GoBackButton', () => {
  const mockT = jest.fn((key) => {
    const translations = {
      'ui.default.goBackToSite': 'Go back to site',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    mockT.mockClear();
  });

  test('should render with href prop', () => {
    const href = 'https://example.com';
    render(<GoBackButton href={href} t={mockT} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', href);
  });

  test('should call t() translation function with correct key', () => {
    render(<GoBackButton href="https://example.com" t={mockT} />);

    expect(mockT).toHaveBeenCalledWith('ui.default.goBackToSite');
    expect(mockT).toHaveBeenCalledTimes(1);
  });

  test('should render translated button text', () => {
    render(<GoBackButton href="https://example.com" t={mockT} />);

    expect(screen.getByText('Go back to site')).toBeInTheDocument();
  });

  test('should render Icon component with correct props', () => {
    render(<GoBackButton href="https://example.com" t={mockT} />);

    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-type', 'arrow');
    expect(icon).toHaveAttribute('data-size', 'small');
  });

  test('should validate PropTypes on mount', () => {
    const checkPropTypesSpy = jest.spyOn(PropTypes, 'checkPropTypes');

    render(<GoBackButton href="https://example.com" t={mockT} />);

    expect(checkPropTypesSpy).toHaveBeenCalledWith(
      GoBackButton.propTypes,
      { href: 'https://example.com', t: mockT },
      'prop',
      'GoBackButton',
    );

    checkPropTypesSpy.mockRestore();
  });

  test('should render with different href values', () => {
    const { rerender } = render(<GoBackButton href="/home" t={mockT} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/home');

    rerender(<GoBackButton href="/admin" t={mockT} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/admin');
  });

  test('should use custom translation when t() returns different text', () => {
    const customT = jest.fn(() => 'Retour au site');
    render(<GoBackButton href="https://example.com" t={customT} />);

    expect(screen.getByText('Retour au site')).toBeInTheDocument();
    expect(customT).toHaveBeenCalledWith('ui.default.goBackToSite');
  });

  test('should render all child elements correctly', () => {
    const { container } = render(<GoBackButton href="https://example.com" t={mockT} />);

    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();

    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();

    const text = screen.getByText('Go back to site');
    expect(text).toBeInTheDocument();
    expect(text.tagName).toBe('P');
  });

  test('should handle multiple renders with same props', () => {
    const { rerender } = render(<GoBackButton href="https://example.com" t={mockT} />);
    expect(mockT).toHaveBeenCalledTimes(1);

    rerender(<GoBackButton href="https://example.com" t={mockT} />);
    expect(mockT).toHaveBeenCalledTimes(2);
  });
});
