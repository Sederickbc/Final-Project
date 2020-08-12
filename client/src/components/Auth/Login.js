import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { signup } from "../../utils/API";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    marginTop: "5vh",
    borderRadius: "10px",
    width: "80vw",
    margin: "auto",
    backgroundColor: "#00203FFF",
    padding: "30px"
  },
  input: {
    backgroundColor: "#ADEFD1FF",
    width: "60%",
    marginLeft: "20%"
  },
  warning: {
    color: "red",
    textAlign: "center"
  }
}));

export default function LoginForm() {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    lat: "",
    lng: ""
  });
  const [warningText, setWarningText] = useState("");
  useEffect(() => {
    window.addEventListener("load", () => {
      navigator.geolocation.getCurrentPosition((loc) => {
        console.log(loc);
        setUserInfo({
          ...userInfo,
          lat: loc.coords.latitude,
          lng: loc.coords.longitude
        });
      });
    });
  }, []);

  const handleInputChange = ({ target: { name, value } }) => {
    setUserInfo({ ...userInfo, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInput()) {
      //some API call to server and sign up
      signup(userInfo).then(({ data }) => console.log(data));
    }
  };

  const validateInput = () => {
    const regex = new RegExp(/([^@]+)@([^@]+)\.(.+)$/i);
    if (!regex.test(userInfo.email)) {
      setWarningText("That is not a valid email!");
      return false;
    }
    if (
      !userInfo.firstName ||
      !userInfo.lastName ||
      !userInfo.email ||
      !userInfo.password ||
      !userInfo.passwordConfirm
    ) {
      setWarningText("Please fill out all required fields!");
      return false;
    }
    if (userInfo.password !== userInfo.passwordConfirm) {
      setWarningText("Please make sure the passwords match!");
      return false;
    }

    return true;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={classes.root}
      noValidate
      autoComplete="off"
    >
      <p className={classes.warning}>{warningText}</p>
      <TextField
        id="outlined-secondary"
        label="email"
        name="email"
        onChange={handleInputChange}
        variant="outlined"
        className={classes.input}
      />

      <TextField
        id="outlined-secondary"
        label="Password"
        name="password"
        type="password"
        onChange={handleInputChange}
        variant="outlined"
        className={classes.input}
      />
      
   
      <Button variant="contained" type="submit" color="primary">
        Submit
      </Button>
    </form>
  );
}