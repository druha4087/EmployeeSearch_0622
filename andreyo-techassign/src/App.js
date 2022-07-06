import { React, useState, Component } from "react";
import { TextField, Button, Tooltip, Box, Typography, Modal, Switch, FormControl, FormGroup, FormControlLabel, ToggleButton, ToggleButtonGroup, Card, Chip, Stack, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BusinessIcon from '@mui/icons-material/Business';
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

  //Retrieves top earners per role
  //Note: this solution relies on the assumption that each role earns less than their superior role and more than their subordinate role 
  //(eg. employees earn less than managers and more than trainees)
  function getTopSalaries(entries){
    let top = [];
    let manArr = [];
    let empArr = [];
    let trainArr = [];

    for (let j = 0; j < entries.length; j++) {
      if (entries[j].role !== 'Earnings') {
        if (entries[j].role.includes('Manager')){
          manArr.push(entries[j]);
        }
        if (entries[j].role.includes('Employee')){
          empArr.push(entries[j]);
        }
        if (entries[j].role.includes('Trainee')){
          trainArr.push(entries[j]);
        }
      }
    }

    manArr.sort((a,b) => b.salary - a.salary);
    empArr.sort((a,b) => b.salary - a.salary);
    trainArr.sort((a,b) => b.salary - a.salary);

    if(manArr.length){
      top.push(manArr[0].salary);
    }
    if(empArr.length){
      top.push(empArr[0].salary);
    }
    if(trainArr.length){
      top.push(trainArr[0].salary);
    }

    return top;
  }

  //Creates an array with employees organized in the organizational structure
  function orgStruct(props) {
    var parentChildArr = []
    for (let i = 0; i < props.length; i++) {
      if(props[i].report_line[0] !== ''){
        parentChildArr[i] = [];
        parentChildArr[i] = props[i];
        parentChildArr[i].children = [];
        for (let j = 0; j < props[i].report_line.length; j++) {
          for (let k = 0; k < props.length; k++) {
            if(props[i].report_line[j] === props[k].empl_id){
              parentChildArr[i].children[k] = props[k];
            }
          }
        }
      }
    }
    return parentChildArr;
  }


  //Outputs data in the organizational structure hierarchy
  //Bug: outputs incorrect search results
  function nestedList(props){
    const output = orgStruct(props);

    return (
      <div>
        {output?.map((parent, index) => {
          return (
            <li key={index}>
              <Stack direction="row" spacing={1}>
                <Chip label={parent.role} style={parent.empl_id.startsWith("M")?
                {backgroundColor:"#4a5e6d", color:"white"} : {backgroundColor:"#768ea2", color:"white"}}/>

                <Chip icon={<AccountCircleIcon />} label={"["+parent.empl_id+"] "+parent.f_name+" "+parent.l_name} color="primary"/>
                <Chip icon={<CalendarMonthIcon />} label={parent.dob} color="secondary" variant="outlined"/>
                <Chip icon={<AttachMoneyIcon />} label={"R"+parent.salary} color="error" variant="outlined"/>
              </Stack>
              {parent.children?.map((child, index) => {
                return (
                  <ul>
                  <li key={index}>
                    <Stack direction="row" spacing={1}>
                    <ArrowForwardIosIcon fontSize="small"/>
                      <Chip label={child.role} style={parent.empl_id.startsWith("E")?
                      {backgroundColor:"#b3c0cb", color:"black"} : {backgroundColor:"#768ea2", color:"white"}}/>

                      <Chip icon={<AccountCircleIcon />} label={"["+child.empl_id+"] "+child.f_name+" "+child.l_name} color="primary"/>
                      <Chip icon={<CalendarMonthIcon />} label={child.dob} color="secondary" variant="outlined"/>
                      <Chip icon={<AttachMoneyIcon />} label={"R"+child.salary} color="error" variant="outlined"/>
                    </Stack>
                    {child.children?.map((g_child, index) => {
                      return (
                        <ul>
                        <li key={index}>
                          <Stack direction="row" spacing={1}>
                          <ArrowForwardIosIcon fontSize="small"/>
                            <Chip label={g_child.role} style={{backgroundColor:"#b3c0cb", color:"black"}}/>
                            <Chip icon={<AccountCircleIcon />} label={"["+g_child.empl_id+"] "+g_child.f_name+" "+g_child.l_name} color="primary"/>
                            <Chip icon={<CalendarMonthIcon />} label={g_child.dob} color="secondary" variant="outlined"/>
                            <Chip icon={<AttachMoneyIcon />} label={"R"+g_child.salary} color="error" variant="outlined"/>
                          </Stack>
                        </li>
                        </ul>
                      );
                    })}
                    
                  </li>
                  </ul>
                );
              })}

            </li>
          );
        })}
      </div>
    );
  }
  
  //Checks for all filters before outputting filtered data 
  function List(props) {
    const filteredData = data.filter((data) => {
        //No search bar input
        if (props.input === '') {
          var defaultOut;
          const entries = Object.entries(data);
          if(checkRole(entries)){
            defaultOut = data.f_name.toLowerCase().includes(props.input);
          }
          return defaultOut;
        }
        //Once search bar receives input
        else {
            var results;
            const entries = Object.entries(data);

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
    let topEarners = getTopSalaries(filteredData);
    
    //Checks for which toggle is enabled and outputs the appropriate results
    //Earnings By Role enabled
    if(filteredData.length && roles.includes('Earnings')){
      finalList = filteredData.sort((a,b) => b.salary - a.salary).map((item) => (
          <li key={item.id}>
            {topEarners.includes(item.salary)? (
              <h4>{item.role} Earnings</h4>
            ): null}
            <Stack direction="row" spacing={1}>
              <Chip label={item.role} 
              style={item.empl_id.startsWith("M")? 
              {backgroundColor:"#4a5e6d", color:"white"} : (item.empl_id.startsWith("E")?
              {backgroundColor:"#768ea2", color:"white"} : {backgroundColor:"#b3c0cb", color:"black"})}/>

              <Chip icon={<AccountCircleIcon />} label={"["+item.empl_id+"] "+item.f_name+" "+item.l_name} color="primary"/>
              <Chip icon={<CalendarMonthIcon />} label={item.dob} color="secondary" variant="outlined"/>
              <Chip icon={<AttachMoneyIcon />} label={"R"+item.salary} color="error" variant="outlined"/>
              {topEarners.includes(item.salary)? (
              <Chip label="Top Earner" color="warning"/>
            ): null}
            </Stack>
          </li>
      ))}
    //Organisational Structure enabled
    else if(filteredData.length && roles.includes('Structure')){
      finalList = nestedList(filteredData)
    }
    //Earnings By Role disabled
    else if(filteredData.length){
      finalList = filteredData.map((item) => (
        <li key={item.id}>
          <Stack direction="row" spacing={1}>
            <Chip label={item.role} style={item.empl_id.startsWith("M")? 
              {backgroundColor:"#4a5e6d", color:"white"} : (item.empl_id.startsWith("E")?
              {backgroundColor:"#768ea2", color:"white"} : {backgroundColor:"#b3c0cb", color:"black"})}/>

            <Chip icon={<AccountCircleIcon />} label={"["+item.empl_id+"] "+item.f_name+" "+item.l_name} color="primary"/>
            <Chip icon={<CalendarMonthIcon />} label={item.dob} color="secondary" variant="outlined"/>
            <Chip icon={<AttachMoneyIcon />} label={"R"+item.salary} color="error" variant="outlined"/>
          </Stack>
        </li>
    ))}
    //Search Criteria yielded no results
    else{
      finalList = <h4>No results found</h4>;
    }
    return (
        <ul>
            {finalList}
        </ul>
    )
  }

  //Main output of application
  return (
    <ThemeProvider theme={theme}>
      <div className="wrapper">
          <Card className="card" style={{backgroundColor: "#4a5e6d", width: 500}}>
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
                <ToggleButton sx={buttonStyle} color="primary" id="struct-toggle" value="Structure" aria-label="Structure">
                  <Tooltip title="Organizational Structure" arrow>
                    <BusinessIcon/>
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
}

export default App;