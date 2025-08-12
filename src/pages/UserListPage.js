import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from '@mui/material/Container';
//import Layout from "../components/layout";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Box, Typography, Paper, Button, Stack } from '@mui/material';
import { useNavigate,Link } from 'react-router-dom';
import CJobList from "../components/home/c-job-list";
import { getJobs, getOrders } from "../redux/actions/job.action";
import {Skeleton} from '@mui/material';
import ReactApexChart from 'react-apexcharts';

// Firestor DB
import { db } from "src/config/firebase";


const theme = createTheme();


export default function CJobs() {
  const dispatch = useDispatch();
  const { jobs } = useSelector((state) => state.jobs);
  const [jobArr, setJobArr] = useState(jobs);
  const [testData, setTestData] = useState();
  const navigate = useNavigate()

  //const { userDetails, error,message, isLoading } = useSelector((state) => state.loggedIn);
    
   /* useEffect(() => {
      console.log(userDetails)
     if(userDetails === '' ){
       
        navigate('/login')
        
      }
       
       
    }, [])*/

    const [state, setState] = useState({
      series: [{
        data: [700, 240, 748, 470, 590, 680, 800]
      }],
      options: {
        chart: {
          type: 'bar',
          height: 250,
          toolbar: {
            show: false
          },
          background: 'transparent',
          // background: '#fff',
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
            dataLabels: {
              position: 'top',
              style: {
                colors: ['#ffffff'],
              },
            },
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        },
        colors: ['#000000', '#F97D0B', '#F97D0B', '#F97D0B', '#F97D0B', '#F97D0B', '#F97D0B']
      }
    });

    // Function to get last 7 months dynamically
  const getLastSevenMonths = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date();
    let currentMonthIndex = date.getMonth(); // Subtract 1 month

    if (currentMonthIndex < 0) {
      currentMonthIndex = 11; // Handle case when index goes negative (December of the previous year)
    }

    let lastSevenMonths = [];
    for (let i = 0; i < 7; i++) {
      lastSevenMonths.unshift(months[currentMonthIndex]);
      currentMonthIndex = (currentMonthIndex - 1 + 12) % 12; // Move backwards and loop around
    }

    return lastSevenMonths;
  };

  // Update state with dynamic categories on component mount
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: getLastSevenMonths(),
        },
      },
    }));
  }, []);
 
 
 
 useEffect(() => {
  dispatch(getOrders());  
   dispatch(getJobs());  
   setTimeout(setJobArr(jobs), 1000);
  }, [])

  useEffect( () => {
    const fetchData = async () => {
      try {
          const snapshot = await db.collection("users").get();
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("this would display all the users available on the system!");
          console.log(items);
          setTestData(items);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };

    fetchData();
  }, [] )

  useEffect(() => {
    if(jobArr.length === 0 ){
      setJobArr(jobs);
       }  
     }, [jobs])

  console.log('cmc user data is: ', jobArr);

  return (
      
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
       {/* <h1 style={{position:"relative",fontWeight:"bold",left:"0px",marginBottom:"40px",fontSize:"30px"}}>DASHBOARD</h1> */}
      

       {jobArr.length ?
           
           <CJobList jobs={jobs} />
           :
           <center>
           <Box sx={{ width: 300 }}>
           <Skeleton />
           <Skeleton animation="wave" />
           <Skeleton animation={false} />
         </Box>
         </center>
      }
        </Container>
     
  );
}
