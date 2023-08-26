import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { PasswordInput } from '../password-input';

describe('PasswordInput', () => {
  it('should toggle password visibility when the button is clicked', () => {
    const { getByRole, getByLabelText } = render(
      <div>
        <label htmlFor="password">Password</label>
        <PasswordInput id="password" name="password" />
      </div>
    );
    const input = getByLabelText('Password');
    const button = getByRole('button');

    expect(input.getAttribute('type')).toBe('password');
    fireEvent.click(button);
    expect(input.getAttribute('type')).toBe('text');
    fireEvent.click(button);
    expect(input.getAttribute('type')).toBe('password');
  });
});
