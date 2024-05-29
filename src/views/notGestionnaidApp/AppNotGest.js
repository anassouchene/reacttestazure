import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination
} from '@mui/material';
import { BASE_URL } from '../../config';

const Appartements = () => {
  const { email } = useParams(); // Obtenez l'email à partir des paramètres d'URL
  const [appartements, setAppartements] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  useEffect(() => {
    const fetchAppartements = async () => {
      try {
        const response = await axios.get(`${BASE_URL}Appartements/NotGestionned`, {
          headers: {
            accept: 'text/plain',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (Array.isArray(response.data)) {
          setAppartements(response.data);
        } else if (response.data && response.data.$values) {
          setAppartements(response.data.$values);
        } else {
          setAppartements([]);
        }
      } catch (error) {
        console.error('Error fetching appartements:', error);
      }
    };

    fetchAppartements();
  }, [email]);

  const handleClick = async (id) => {
    const confirmation = await Swal.fire({
      title: 'Confirmation',
      text: `Êtes-vous sûr de vouloir sélectionner l'appartement ${id} pour ${email} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    });

    if (confirmation.isConfirmed) {
      try {
        await axios.post(`${BASE_URL}Attribution`, {
          email: email,
          appartementId: id
        });

        await Swal.fire({
          title: 'Succès',
          text: `L'appartement ${id} a été attribué à ${email} avec succès !`,
          icon: 'success'
        });
      } catch (error) {
        console.error('Error assigning appartement:', error);
        await Swal.fire({
          title: 'Erreur',
          text: `Une erreur s'est produite lors de l'attribution de l'appartement ${id} à ${email}.`,
          icon: 'error'
        });
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Liste des appartements sans gestionnaire
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appartements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((appartement) => (
              <TableRow key={appartement.id}>
                <TableCell>{appartement.id}</TableCell>
                <TableCell>
                  <img
                    src={`appartement.png`}
                    alt={`Appartement ${appartement.id}`}
                    style={{ width: '150px', height: 'auto', cursor: 'pointer' }} // Ajoutez 'cursor: pointer' pour indiquer que l'image est cliquable
                    onClick={() => handleClick(appartement.id)} // Utilisez handleClick pour gérer le clic de l'image
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[3, 5, 10]}
          component="div"
          count={appartements.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
};

export default Appartements;
