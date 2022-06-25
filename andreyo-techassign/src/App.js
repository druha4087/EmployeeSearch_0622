import { React, useState } from "react";
import { TextField, Button, Tooltip, Box, Typography, Modal, Switch, FormControl, FormGroup, FormControlLabel, ToggleButton, ToggleButtonGroup, Card } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import data from "./Components/ListData.json"
import "./App.css";

function App() {

  /*
  --------STYLES---------
  */


  const theme = createTheme({
    palette: {
      primary: {
        main: '#b9fbc0',
      },
      secondary: {
        main: '#fffded',
      },
    },
  });

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 10,
    borderRadius: 2,
    p: 4,
  };

  const groupStyle = {
    borderRadius: 1,
    height: 30,
    border: 0,
    mt: 0.3,
  };

  const buttonStyle = {
    borderRadius: 1,
    height: 30,
    border: '1px solid #000',
  }

  /*
  ------EVENT HANDLERS------
  */

  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const roleToggle = (e, newFormats) => {
    setFormats(newFormats);
    data.role = newFormats
  };

  const nameToggle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.checked,
    });
  };

  /*
  -------HOOKS--------
  */

  const [inputText, setInputText] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [formats, setFormats] = useState(() => ['Manager', 'Employee', 'Trainee']);
  const [state, setState] = useState({
    f_name: true,
    l_name: true,
    role: formats,
    dob: false, //add date picker
    empl_id: false,
    salary: false //add scale selector
  });

  /*
  ------FUNCTIONS------
  */

  function checkRole(entries){
    var pass = false;
    for (let i = 0; i < formats.length; i++) {
      if (entries[6][1] === formats[i]) {
        pass = true;
      }
    }
    return pass;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="wrapper">
        <div className="search">
          <Card className="card" style={{backgroundColor: "#4a5e6d"}}>
            <h1>Employee Search</h1>
              <TextField onChange={inputHandler} variant="outlined" fullWidth label="Search" color="primary"/>

              <ToggleButtonGroup sx={groupStyle} value={formats} onChange={roleToggle} aria-label="text formatting">
                <Tooltip title="Filter" arrow>
                  <Button sx={buttonStyle} variant="outlined" color="primary" onClick={handleOpen}><FilterListIcon>Filter</FilterListIcon></Button>
                </Tooltip>
                <ToggleButton sx={buttonStyle} color="primary" id="manager-toggle" value="Manager" aria-label="Manager">
                  Manager
                </ToggleButton>
                <ToggleButton sx={buttonStyle} color="primary" id="employee-toggle" value="Employee" aria-label="Employee">
                  Employee
                </ToggleButton>
                <ToggleButton sx={buttonStyle} color="primary" id="trainee-toggle" value="Trainee" aria-label="Trainee">
                  Trainee
                </ToggleButton>
              </ToggleButtonGroup>
          </Card>
        

          <Modal open={open} onClose={handleClose} aria-labelledby="title" aria-describedby="description">
            <Box sx={modalStyle} style={{backgroundColor: "#4a5e6d"}}>
              <FormControl component="fieldset" variant="standard">
                <Typography variant="h6" component="h2" color="#b9fbc0">Search By Filter</Typography>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch checked={state.f_name} onChange={nameToggle} name="f_name" />}
                    label="First Name" />
                  <FormControlLabel
                    control={<Switch checked={state.l_name} onChange={nameToggle} name="l_name" />}
                    label="Last Name" />
                </FormGroup>
                <Button variant="outlined" color="primary" onClick={handleClose}>Confirm</Button>
              </FormControl>
            </Box>
          </Modal>

        </div>
        <List input={inputText} />

      </div>
    </ThemeProvider>
  );

  function List(props) {
    const filteredData = data.filter((data) => {
        if (props.input === '') {
            return data;
        }
        else {
            var results;

            const entries = Object.entries(data);
            checkRole(entries);
            console.log(entries[6][1] +"-"+ formats[0])
            

            if (state.f_name === true && checkRole(entries) === true){
              results = results || data.f_name.toLowerCase().includes(props.input);
            }
            if (state.l_name === true && checkRole(entries) === true)
            {
              results = results || data.l_name.toLowerCase().includes(props.input);
            }
            return results;
        }
    })
    return (
        <ul>
            {filteredData.map((item) => (
                <li key={item.id}>{item.role}: {item.empl_id} - {item.f_name} {item.l_name} ({item.dob}), {item.salary}</li>
            ))}
        </ul>
    )
  }
}

export default App;