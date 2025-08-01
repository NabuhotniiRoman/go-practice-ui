import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleButton = ({ onClick }) => {
  return (
    <Button
      fullWidth
      type='button'
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={onClick}
      sx={{
        mt: 2,
        mb: 2,
        borderColor: '#4285f4',
        color: '#4285f4',
        '&:hover': {
          borderColor: '#357abd',
          backgroundColor: 'rgba(66, 133, 244, 0.04)'
        }
      }}
    >
      Увійти через Google
    </Button>
  );
};

export default GoogleButton;
