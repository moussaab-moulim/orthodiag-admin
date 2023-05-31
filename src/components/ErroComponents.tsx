import { Alert, AlertTitle } from '@mui/material';
import React, { Fragment, PropsWithChildren } from 'react';

export function TableErrorComponent() {
  return (
    <Alert severity='error'>
      <AlertTitle>Un error est survenu:</AlertTitle>
      Veuillez ressayer ou contacter le support.
    </Alert>
  );
}

export function DataErrorComponent() {
  return (
    <Alert severity='error'>
      <AlertTitle>Un error est survenu:</AlertTitle>
      Probleme en recupération des données depuis le serveur. Veuillez ressayer
      ou contacter le support.
    </Alert>
  );
}
