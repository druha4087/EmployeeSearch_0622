import { React, useState } from "react";
import { TextField, Button, Tooltip, Box, Typography, Modal, Switch, FormControl, FormGroup, FormControlLabel, ToggleButtonGroup, ToggleButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
// import List from "./Components/List";
import data from "./Components/ListData.json"
import "./App.css";

function App() {
  //Search Input
  const [inputText, setInputText] = useState("");
  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  //Modal Hooks
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Modal Style
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

  //Toggle States
  const [state, setState] = useState({
    f_name: true,
    l_name: true,
    dob: false, //add date picker
    empl_id: false,
    salary: false, //add scale selector
  });

  //Modal Toggle Event Handler
  const nameToggle = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  //Role Toggle States
  const [formats, setFormats] = useState(() => ['Manager', 'Employee', 'Trainee']);

  const roleToggle = (event, newFormats) => {
    setFormats(newFormats);
  };

  return (
    <div className="wrapper">
      <h1>Employee Search</h1>
      <div className="search">
        <TextField
          id="outlined-basic"
          onChange={inputHandler}
          variant="outlined"
          fullWidth
          label="Search"
          color="primary"
        />
        <Tooltip title="Filter" arrow>
          <Button variant="outlined" color="primary" onClick={handleOpen}><FilterListIcon>Filter</FilterListIcon></Button>
        </Tooltip>

        <Modal open={open} onClose={handleClose} aria-labelledby="title" aria-describedby="description">
          <Box sx={modalStyle}>
              <FormControl component="fieldset" variant="standard">
                <Typography id="title" variant="h6" component="h2">Search By Filter</Typography>
                <FormGroup>
                  <ToggleButtonGroup  value={formats} onChange={roleToggle} aria-label="text formatting">
                      <ToggleButton id="manager-toggle" value="Manager" aria-label="Manager">
                        Manager
                      </ToggleButton>
                      <ToggleButton id="employee-toggle" value="Employee" aria-label="Employee">
                        Employee
                      </ToggleButton>
                      <ToggleButton id="trainee-toggle" value="Trainee" aria-label="Trainee">
                        Trainee
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <FormControlLabel
                      control={
                        <Switch checked={state.f_name} onChange={nameToggle} name="f_name" />
                      }
                      label="First Name"
                    />
                    <FormControlLabel
                      control={
                        <Switch checked={state.l_name} onChange={nameToggle} name="l_name" />
                      }
                      label="Last Name"
                    />
                </FormGroup>
                <Button variant="outlined" color="success" onClick={handleClose}>Confirm</Button>
              </FormControl>
          </Box>
        </Modal>
        
      </div>
      <List input={inputText} />
      
    </div>
  );

  function List(props) {
    const filteredData = data.filter((data) => {
        if (props.input === '') {
            return data;
        }
        else {
            var results;
            if (state.f_name === true){
              results = results || data.f_name.toLowerCase().includes(props.input);
            }
            if (state.l_name === true)
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