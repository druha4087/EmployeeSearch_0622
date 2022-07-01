import { React, useState, Component } from "react";
import { TextField, Button, Tooltip, Box, Typography, Modal, Switch, FormControl, FormGroup, FormControlLabel, ToggleButton, ToggleButtonGroup, Card, Chip, Stack, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import data from "./Components/ListData.json"
import "./App.css";

function App() {

  /*
  --------STYLES---------
  */

  //General color theme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#b9fbc0',
      },
      secondary: {
        main: '#4a5e6d',
      },
    },
  });

  //Styling of filter modal
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

  //Styling of role filter toggle group
  const groupStyle = {
    borderRadius: 1,
    height: 30,
    border: 0,
    mt: 0.3,
  };

  //Styling of role filter toggle buttons
  const buttonStyle = {
    borderRadius: 1,
    height: 30,
    border: '1px solid #000',
  }

  /*
  ------EVENT HANDLERS------
  */

  //Handles change in search bar input
  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  //Handles change in role filter toggles
  const roleToggle = (e, newRoles) => {
    setRoles(newRoles);
    data.role = newRoles;
  };

  //Handles change in search criteria toggles
  const filterToggle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.checked,
    });
  };

  //Handles change in salary filter state
  const salaryChange = (e) => {
    setSalary(e.target.value);
  };

  /*
  -------HOOKS--------
  */

  //Hook for search bar input text 
  const [inputText, setInputText] = useState("");

  //Hook for state of filter modal
  const [openFilter, setFilterOpen] = useState(false);

  //Hooks for opening and closing filter modal
  const handleFilterOpen = () => setFilterOpen(true);
  const handleFilterClose = () => setFilterOpen(false);

  //Hook for role filters
  const [roles, setRoles] = useState(() => ['Manager', 'Employee', 'Trainee']);

  //Hook for search criteria filters
  const [state, setState] = useState({
    f_name: true,
    l_name: true,
    role: roles
  });

  //Hook for salary filter
  const [salary, setSalary] = useState('');

  //Hook for birthdate filter
  const [dob, setDOB] = useState(new Date());


  /*
  ------CLASSES-------
  */

  //Class that handles salary filter component
  class SalarySelect extends Component {
    constructor() {
      super();
      this.state = {
          showHideSalary: state.salary,
      };
      this.hideComponent = this.hideComponent.bind(this);
    }
  
    hideComponent() {
          this.setState({ showHideSalary: !this.state.showHideSalary });
    }
  
    render() {
      const { showHideSalary } = this.state;
      return (
        <div height="400px">  
        <FormControlLabel
            control={<Switch checked={state.salary} onChange={filterToggle} name="salary" />}
            label="Salary" />
        {showHideSalary && (
          <Box>
            <TextField
                id="min-salary-select"
                value={salary}
                label="Min. Salary"
                select
                fullWidth
                onChange={salaryChange}
                size="small"
              >
                <MenuItem value={25000}>R25,000</MenuItem>
                <MenuItem value={50000}>R50,000</MenuItem>
                <MenuItem value={75000}>R75,000</MenuItem>
                <MenuItem value={100000}>R100,000</MenuItem>
                <MenuItem value={125000}>R125,000</MenuItem>
              </TextField>
          </Box>
          )}
        </div>
      );
    }
  }

  //Class that handles date filter component
  class DateSelect extends Component {
    constructor() {
      super();
      this.state = {
          showHideDate: state.dob,
      };
      this.hideComponent = this.hideComponent.bind(this);
    }
  
    hideComponent() {
          this.setState({ showHideDate: !this.state.showHideDate });
    }
    
    render() {
      const { showHideDate } = this.state;
      return (
        <div height="400px">  
        <FormControlLabel
            control={<Switch checked={state.dob} onChange={filterToggle} name="dob" />}
            label="Birthdate" />
        {showHideDate && (
          <Box>
            {/* TO-DO: Bug with Textfield doesn't allow for typing date following backspace being pressed */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="D.O.B. Before"
                inputFormat="DD/MM/YYYY"
                value={dob}
                color="primary"
                onChange={(newDate) => {setDOB(newDate);}}
                renderInput={(params) => <TextField {...params} 
                sx={{
                  svg: { color: '#b9fbc0' },
                }} />}
              />
            </LocalizationProvider>
          </Box>
          )}
        </div>
      );
    }
  }

  /*
  ------FUNCTIONS------
  */

  //Checks whether role of employee matches current role filter
  function checkRole(entries){
    var pass = false;
    for (let i = 0; i < roles.length; i++) {
      if (entries[6][1] === roles[i]) {
        pass = true;
      }
    }
    return pass;
  }

  //Checks whether birthdate of employee predates current DOB filter
  function checkDate(entries){
    var date = new Date(entries[4][1]);
    if (date < dob.$d) {
      return true
    }
    else{
      return false
    }
  }

  //Main output of application
  return (
    <ThemeProvider theme={theme}>
      <div className="wrapper">
          <Card className="card" style={{backgroundColor: "#4a5e6d", width: 400}}>
            <h1>Employee Search</h1>
              {/* Search bar */}
              <TextField onChange={inputHandler} variant="outlined" fullWidth label="Search" color="primary"/>
              {/* Filter Toggle Group */}
              <ToggleButtonGroup sx={groupStyle} value={roles} onChange={roleToggle} aria-label="text formatting">
                <Tooltip title="Filter" arrow>
                  <Button sx={buttonStyle} variant="outlined" color="primary" onClick={handleFilterOpen}><FilterListIcon/></Button>
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
                <ToggleButton sx={buttonStyle} color="primary" id="earnings-toggle" value="Earnings" aria-label="Earnings">
                  <Tooltip title="Earnings by Role" arrow>
                    <ShowChartIcon/>
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
          </Card>
        
          {/* Filter Modal */}
          <Modal open={openFilter} onClose={handleFilterClose} aria-labelledby="title" aria-describedby="description">
            <Box sx={modalStyle} style={{backgroundColor: "#4a5e6d"}}>
              <FormControl component="fieldset" variant="standard">
                <Typography variant="h6" component="h2" color="#b9fbc0">Search By Filter</Typography>
                <FormGroup>
                  {/* First Name Filter Toggle */}
                  <FormControlLabel
                    control={<Switch checked={state.f_name} onChange={filterToggle} name="f_name" />}
                    label="First Name" />
                  {/* Last Name Filter Toggle */}
                  <FormControlLabel
                    control={<Switch checked={state.l_name} onChange={filterToggle} name="l_name" />}
                    label="Last Name" />
                  {/* Salary Filter Toggle */}
                  <SalarySelect/>
                  {/* Birthdate Filter Toggle */}
                  <DateSelect/>
                </FormGroup>
                <Button style={{margin: "10px"}} variant="outlined" color="primary" onClick={handleFilterClose}>Confirm</Button>
              </FormControl>
            </Box>
          </Modal>

        {/* Output List based on search criteria */}
        <List input={inputText} />

      </div>
    </ThemeProvider>
  );

  //Checks for all filters before outputting filtered data 
  function List(props) {
    const filteredData = data.filter((data) => {
        if (props.input === '') {
            return data;
        }
        else {
            var results;

            const entries = Object.entries(data);
            checkRole(entries);
            //Checks for first and last name filter present within each Filter Check
            //Salary Filter Check
            if(state.salary === true){
              if (state.f_name === true && checkRole(entries) === true && data.salary >= salary){
                results = results || data.f_name.toLowerCase().includes(props.input);
              }
              if (state.l_name === true && checkRole(entries) === true && data.salary >= salary)
              {
                results = results || data.l_name.toLowerCase().includes(props.input);
              }
            }
            //DOB Filter Check
            else if(state.dob === true){
              if (state.f_name === true && checkRole(entries) === true && checkDate(entries)){
                results = results || data.f_name.toLowerCase().includes(props.input);
              }
              if (state.l_name === true && checkRole(entries) === true && checkDate(entries))
              {
                results = results || data.l_name.toLowerCase().includes(props.input);
              }
            }
            //Default
            else{
              if (state.f_name === true && checkRole(entries) === true){
                results = results || data.f_name.toLowerCase().includes(props.input);
              }
              if (state.l_name === true && checkRole(entries) === true)
              {
                results = results || data.l_name.toLowerCase().includes(props.input);
              }
            }
            return results;
        }
    })

    let finalList;
    if(filteredData.length && roles.includes('Earnings')){
      finalList = filteredData.sort((a,b) => b.salary - a.salary).map((item) => (
        <li key={item.id}>
          <Stack direction="row" spacing={1}>
            <Chip label={item.role} color="secondary"/>
            <Chip icon={<AccountCircleIcon />} label={"["+item.empl_id+"] "+item.f_name+" "+item.l_name} color="primary"/>
            <Chip icon={<CalendarMonthIcon />} label={item.dob} color="secondary" variant="outlined"/>
            <Chip icon={<AttachMoneyIcon />} label={"R"+item.salary} color="error" variant="outlined"/>
          </Stack>
        </li>
      ))}
    else if(filteredData.length){
      finalList = filteredData.map((item) => (
        <li key={item.id}>
          <Stack direction="row" spacing={1}>
            <Chip label={item.role} color="secondary"/>
            <Chip icon={<AccountCircleIcon />} label={"["+item.empl_id+"] "+item.f_name+" "+item.l_name} color="primary"/>
            <Chip icon={<CalendarMonthIcon />} label={item.dob} color="secondary" variant="outlined"/>
            <Chip icon={<AttachMoneyIcon />} label={"R"+item.salary} color="error" variant="outlined"/>
          </Stack>
        </li>
    ))}
    else{
      finalList = <li>No results found.</li>
    }
    return (
        <ul>
            {finalList}
        </ul>
    )
  }
}

export default App;