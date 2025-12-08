import React from "react";
import bxNetworkChartSvg from "./african-14.jpg";
import accentLogo from "./accentLogo.png";
import barcode from "./barcode2.png";

import LoginForm from "./login-form";
/*overlapGroup1: "rectangle-1-1.png",
iconLock: "bx-lock-open-alt-svg-1.png",
iconUser: "bx-user-svg-1.png",*/

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const loginPageData = {
  spanText1: "Admin Login",
  spanText2: "Email Address",
  spanText3: "Password",
  spanText4: "Login",
  spanText5: "Don't have an account yet?",
  spanText6: "Register here",
  spanText7: "Welcome to CMC Network",
  spanText8: "We're on a mission to help MBE & WBE Contractors grow",
  spanText9:
    "Connect with other contractors, resources and more in our community.",
  spanText10: "Apply to our foundation program & project matching",
};

const {
  spanText1,
  spanText2,
  spanText3,
  spanText4,
  spanText5,
  spanText6,
  spanText7,
  spanText8,
  spanText9,
  spanText10,
} = loginPageData;

const useStyles = makeStyles((theme) => ({
  root: {
    //yellow -dagogo
    background: theme.palette.background.themeYellow /*"#fff6bd"*/,
    //background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
    //  theme.palette.primary.dark,
    //  0.5
    //)} 100%)`,
    color: theme.palette.primary.contrastText,
  },
  leftSection: {
    background: "#fff" /*"#ffffff"*/,
    width: "33%",
    // width: '60%',
  },
  rightSection: {
    //blue - dagogo
    background:
      "#21C9CF" /*theme.palette.background.themeBlue - YOU REALLY SHOULD USE UR THEME*/,
    // background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
    //   theme.palette.primary.dark,
    //   0.5
    // )} 100%)`,
    width: "77%",
    color: theme.palette.primary.contrastText,
  },
}));

const LoginUpdatedPage = () => {
  const theme = useSelector(({ fuse }) => fuse?.settings?.themes);
  // console.log("OYA WHAT IS THEME-->",theme)
  const classes = useStyles(theme);

  return (
    <div
      className={clsx(
        classes.root,
        "flex flex-auto items-center h-full bg-[#fff6bd] justify-center flex-shrink-0 p-16 md:p-24"
      )}
    >
      {/* <Modal /> */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex w-full max-h-[42rem] max-w-400 md:max-w-lg rounded-20 shadow-2xl overflow-hidden"
      >
        <div
          className={clsx(
            classes.leftSection,
            " flex-col flex-1 items-center justify-center p-56 md:p-64 m-0"
          )}
        >
        
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
            >
              <div className="flex items-center">
                <img
                  className="logo-icon w-28"
                  src="/assets/bridgetechlogo.png"
                  alt="logo"
                />
                <div className="border-l-1 mr-4 w-1 h-40" />
                <div>
                  <div className="text-16 font-bold leading-none text-black">
                    NURTURER
                  </div>
                </div>
              </div>
            </motion.div>

            <LoginForm />
            {/* </CardContent> */}

            <div className="flex flex-row items-center  pb-32" style={{width:"95%"}}>
              <div className=" ">
                <span className="font-normal text-black mr-8">
                  Don't have an account?
                </span>
                <Link
                  className="font-normal"
                  to="/register"
                  style={{ color: "#21C9CF" }}
                >
                  Register
                </Link>
              </div>
              {/* { */}
                <Link
                  className="font-normal mt-10  md:ml-5"
                  to="/forgot-password"
                  style={{
                    // position: "relative",
                    top: "-0.5rem",
                    color: "#21C9CF",
                  }}
                >
                  Forgot Password?
                </Link>
              {/* // } */}
            </div>
            {/* </Card> */}
          </div>
        <div
          className={clsx(
            classes.rightSection,
            "hidden md:flex flex-1 items-center justify-center p-64"
          )}
        >
          <div className="max-w-320">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            >
              <Typography
                variant="h3"
                color="inherit"
                className="font-semibold leading-tight"
              >
                Welcome <br />
                to <br /> NURTURER!
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
            >
              <Typography variant="subtitle1" color="inherit" className="mt-32">
                The AI powered assistant that keeps you in the conversation.
                <ul
                  style={{
                    listStyle: "square",
                    color: "#FFFFF",
                    marginLeft: "40px",
                  }}
                >
                  <li style={{ marginTop: "5px" }}>Stay Top-Of-Mind</li>
                  <li style={{ marginTop: "5px" }}>Save Time, Close More</li>
                  <li style={{ marginTop: "5px" }}>Never Miss a Lead</li>
                </ul>
              </Typography>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginUpdatedPage;

/* left hand DIV contents - former - there are corresponding styles in the css

 <img className="bx-network-chartsvg" src={bxNetworkChartSvg} alt="bx-network-chart.svg" />
    <div className="flex-col"/>
    <div className="login-to-access josefinsans-bold-black-26px">
    <span className="josefinsans-bold-black-26px">{spanText1}</span>
    </div>
    <div className="overlap-group3">
    <div className="email-address josefinsans-normal-black-16px-2">
    
    <span className="josefinsans-normal-black-16px-2">{spanText2}</span>
    </div>
    <div className="rectangle"></div>
    <img className="icon" src={iconUser} alt="icon-user" />
    </div>
    <div className="overlap-group2">
    <div className="password josefinsans-normal-black-16px-2">
    <span
    className="josefinsans-normal-black-16px-2">{spanText3}</span>
    </div>
    <div className="rectangle"></div>
    <img className="icon" src={iconLock} alt="icon-lock" />
    </div>
    <div className="overlap-group">
    <div className="login josefinsans-bold-white-16px">
    <span className="josefinsans-bold-white-16px">{spanText4}</span>
    </div>
    </div>
    <p className="dont-have-an-accoun josefinsans-normal-black-14px">
    <span className="josefinsans-normal-black-14px">{spanText5}</span>
    <span className="span1">{spanText6}</span>
    </p>
*/

/**
 * right hand  DIV contents former - there are corresponding styles in the css
 * 
 *  <div className="rectangle-2"></div>
    <h1 className="title librebarcode128text-normal-white-60px">
    <span className="librebarcode128text-normal-white-60px">{spanText7}</span>
    </h1>
    <div className="group-1">
    <p className="were-on-a-mission-t josefinsans-bold-white-18px">
    <span className="josefinsans-bold-white-18px">{spanText8}</span>
    </p>

    

<p className="connect-with-other-c josefinsans-normal-white-18px">
<span className="josefinsans-normal-white-18px">{spanText9}</span>
</p>
<p className="apply-to-our-foundat josefinsans-normal-white-18px">
<span
className="josefinsans-normal-white-18px">{spanText10}</span>
</p>
</div>
 */
