const ErrorMessage = ({ message }) => {
  return (
    <div style={{ 
      backgroundColor: '#ffcccc', 
      color: '#cc0000', 
      padding: '10px', 
      borderRadius: '5px', 
      marginBottom: '10px' 
    }}>
      {message}
    </div>
  );
};

export default ErrorMessage;