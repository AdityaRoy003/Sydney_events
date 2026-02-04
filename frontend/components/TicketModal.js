import { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Alert
} from '@mui/material';

export default function TicketModal({ open, onClose, event }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    if (!consent) {
      setError('You must agree to receive updates.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axios.post(`${API_URL}/subscribe`, {
        email,
        consent,
        eventId: event._id
      });
      // Redirect to original event URL
      window.open(event.url, '_blank');
      onClose();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-blue-600 font-bold">Get Tickets for {event?.title}</DialogTitle>
      <DialogContent>
        <DialogContentText className="mb-4">
          Enter your email to proceed to the ticket page. We'll verify you're human and keep you updated!
        </DialogContentText>

        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

        <TextField
          autoFocus
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              color="primary"
            />
          }
          label="I agree to receive event updates and newsletters."
          className="mt-2"
        />
      </DialogContent>
      <DialogActions className="p-4">
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-bold"
        >
          {loading ? 'Processing...' : 'Continue to Tickets'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
