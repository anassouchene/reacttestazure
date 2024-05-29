import React from 'react';
import { Container, Grid, Typography, List, ListItem, ListItemIcon, ListItemText, TextField, Button, Box } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';
import './detail.css';

const ContactezNous = () => {
  return (
    <Box className="contact-page" sx={{ py: 8 }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Contactez-nous
            </Typography>
            <Typography variant="body1" paragraph>
              N'hésitez pas à nous contacter pour toute question ou demande d'information.
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText primary="contact@exemple.com" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone />
                </ListItemIcon>
                <ListItemText primary="+123 456 7890" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText primary="Adresse, Ville, Pays" />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <form>
              <TextField
                fullWidth
                margin="normal"
                id="formName"
                label="Nom"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                margin="normal"
                id="formEmail"
                label="Email"
                type="email"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                margin="normal"
                id="formMessage"
                label="Message"
                multiline
                rows={5}
                variant="outlined"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Envoyer
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactezNous;
