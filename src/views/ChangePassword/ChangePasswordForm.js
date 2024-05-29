import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CssBaseline,
  Paper
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}Account/forgot-password`, { email });
      console.log(response.data);
      if (response.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Code de confirmation envoyé',
          text: 'Un code de confirmation a été envoyé à votre boîte email.',
        });
        navigate('/resetPassword');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue. Veuillez réessayer.',
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center">
            Réinitialiser le mot de passe
          </Typography>
          <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse e-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: 3 }}
            >
              Envoyer le code
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordForm;
