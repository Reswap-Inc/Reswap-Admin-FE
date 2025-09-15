import React from 'react';
import { TextField, FormHelperText } from '@mui/material';

const Inputcom = ({ name, label, value, error, onChange }) => (
  <div>
    <label style={{ display: 'block', marginBottom: 4 }}>
      {label} <span style={{ color: 'red' }}>*</span>
    </label>
    <TextField
      name={name}
      fullWidth
      value={value}
      onChange={onChange}
      error={!!error}
    />
    {error && <FormHelperText sx={{ fontSize: '0.75rem', color: 'red' }}>{error}</FormHelperText>}
  </div>
);

export default Inputcom;