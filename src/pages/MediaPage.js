import { Helmet } from 'react-helmet-async';
import { Grid, Container, Typography, FormControl, Box, Select, MenuItem, Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSongs } from 'src/redux/actions/group.action';
//import { fetchUserData } from 'src/redux/actions/auth.action';
//import { saveCurrentFarmersToDisplay,saveFilteredFarmers,saveCurrentLocationFilter,saveCurrentCropTypeFilter,saveCurrentCropFilter,saveTotalPagesFarmers } from 'src/redux/reducers/group.slice';

//import { FaFilter } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";

// Components Table
import PlaylistTable from 'src/components/home/playlistTable';
import SongsTable from 'src/components/home/songsTable';

import merge from 'lodash/merge';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { fetchMyTransactions } from 'src/redux/actions/transaction.action';
//import CustomToggleSwitch from 'src/components/buttons/CustomToogleSwitch';
//import CustomSearchBar from 'src/components/global/CustomSearchBar';
//import SearchIcon from '@mui/icons-material/Search';
//import ViewStudents from 'src/components/students/ViewStudents';
//import AddStudent from 'src/components/students/AddStudent';
//import { getStudents } from 'src/redux/actions/student.action';
//
//import CampaignCard from 'src/components/listcards/campaign-card';
//
//import redboy from 'src/assets/images/jeansfarmer.jpeg';
//import greenboy from 'src/assets/images/farmer2.jpeg';
//import athlete from 'src/assets/images/farmer3.jpeg';
//
//import amfootball from 'src/assets/images/farmer4.jpeg'
//
//import PitchCard from 'src/components/listcards/pitch-card';
//import Paginate from 'src/components/buttons/Paginate';
//
//import Pagination from '@mui/material/Pagination';
//import Stack from '@mui/material/Stack';


/*import farmer1 from 'src/assets/images/jeansfarmer.jpeg';
import farmer2 from 'src/assets/images/farmer2.jpeg';
import farmer3 from 'src/assets/images/farmer3.jpeg';
import farmer4 from 'src/assets/images/farmer4.jpeg';
import farmer5 from 'src/assets/images/farmer5.jpeg';
import farmer6 from 'src/assets/images/farmer6.jpeg';
import farmer7 from 'src/assets/images/farmer7.jpeg';
import farmer8 from 'src/assets/images/farmer8.jpeg';
import farmer9 from 'src/assets/images/farmer9.jpeg';
import farmer10 from 'src/assets/images/farmer10.jpeg';*/
     
//import noimage from 'src/assets/images/no-image.jpg';



import FarmerStatsLong from 'src/components/home/farmer-stats-long';
import SongsStatsLong from 'src/components/home/songs-stats-long';
import SmallCustomSearchBar from 'src/components/global/SmalllCustomSearchBar';

import { FaPlus } from 'react-icons/fa6';
import PlaylistStatsLong from 'src/components/home/playlist-stats-long';
import MediaStatsLong from 'src/components/home/media-stats-long';

// Firebase DB
import { db } from 'src/config/firebase';


export default function MediaPage() {
  const theme = useTheme();
  const { page } = useParams();
    
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { 
    allSongs
  } = useSelector((state) => state.group);

  const currentFarmersToDisplay = [];

//   const currentFarmersToDisplay = [
//       {
// OriginalResponseId: "6753281ed9cdcb0033aec89e",
// age: "50",
// agentAddedId: "276",
// agent_user_id: "673cba0ae048530033a98bf8",
// challenges: "problème de matériel agricole tracteur ",
// chemicals: "non ",
// cost: "120000f",
// createdAt: "2024-12-06T16:36:46.459Z",
// cropType: "Cash Crops",
// desire: "mes compétences ",
// experience: "20ans",
// familysize: "20",
// farmSize: "7",
// farmerId: "145147",
// farmerName: "Rose Sagna",
// farmingCrop: "none",
// farmsize: "1ha",
// firstName: "Rose",
// gender: "féminin ",
// gps: "12.7653468,-15.1089023",
// harvestPurpose: "sales and family use",
// harvestSize: "0 tons",
// id: "67535b154f3f8f74863d69b5",
// identification: "no",
// index: 0,
// insurance: "non ",
// insuranceinterest: "Oui ",
// interest: "Oui ",
// lastHarvest: "30",
// lastName: "Sagna",
// location: "Oyo Nigeria",
// locationName: "Département ",
// market: "Local Market",
// name: "Rose Sagna",
// noOfChildren: 19,
// noOfSpouse: 1,
// offtake: "marché hebdomadaire de sare Yoba",
// onboardDate: "06-12-2024",
// organic: "non",
// organicFarmingInterest: "Oui ",
// password: "123456",
// phone: "783870215",
// photo: "https://res.cloudinary.com/fullstackbeast/image/upload/v1733502951/ufarmx/f6rw7dqfbnobf9cacwc6.jpg",
// pre_retailer: "Fertilizer Seller",
// produce: "riz  porc chèvre ",
// productSoldTo: "Local market",
// productionsize: "10sacs de 50kg",
// seeds: "reserve personnel",
// smartphone: "No",
// tech: "non",
// typeOfChemical: "none",
// username: null,
// "utilisezvous_lirrigation__oui_or_non": "non ",
// _id:"67535b154f3f8f74863d69b5",
// },

// {
// OriginalResponseId: "6753281ed9cdcb0033aec89e",
// age: "50",
// agentAddedId: "276",
// agent_user_id: "673cba0ae048530033a98bf8",
// challenges: "problème de matériel agricole tracteur ",
// chemicals: "non ",
// cost: "120000f",
// createdAt: "2024-12-06T16:36:46.459Z",
// cropType: "Cash Crops",
// desire: "mes compétences ",
// experience: "20ans",
// familysize: "20",
// farmSize: "7",
// farmerId: "145147",
// farmerName: "Rose Sagna",
// farmingCrop: "none",
// farmsize: "1ha",
// firstName: "Rose",
// gender: "féminin ",
// gps: "12.7653468,-15.1089023",
// harvestPurpose: "sales and family use",
// harvestSize: "0 tons",
// id: "67535b154f3f8f74863d69b5",
// identification: "no",
// index: 0,
// insurance: "non ",
// insuranceinterest: "Oui ",
// interest: "Oui ",
// lastHarvest: "30",
// lastName: "Sagna",
// location: "Oyo Nigeria",
// locationName: "Département de Kolda, Région de Kolda, Sénégal",
// market: "Local Market",
// name: "Rose Sagna",
// noOfChildren: 19,
// noOfSpouse: 1,
// offtake: "marché hebdomadaire de sare Yoba",
// onboardDate: "06-12-2024",
// organic: "non",
// organicFarmingInterest: "Oui ",
// password: "123456",
// phone: "783870215",
// photo: "https://res.cloudinary.com/fullstackbeast/image/upload/v1733502951/ufarmx/f6rw7dqfbnobf9cacwc6.jpg",
// pre_retailer: "Fertilizer Seller",
// produce: "riz  porc chèvre ",
// productSoldTo: "Local market",
// productionsize: "10sacs de 50kg",
// seeds: "reserve personnel",
// smartphone: "No",
// tech: "non",
// typeOfChemical: "none",
// username: null,
// "utilisezvous_lirrigation__oui_or_non": "non ",
// _id:"67535b154f3f8f74863d69b5",
// }

// ]
  
   
 // const { students } = useSelector((state) => state.student);


  const [selectedClass, setSelectedClass] = useState(/.*/ );
const [selectedAgent, setSelectedAgent] = useState(/.*/ );
  const [selectedSection, setSelectedSection] = useState(/.*/ );
  const [selectedFilter, setSelectedFilter] = useState(''); /**not using regular expressions here */
  const [selectedLocation, setSelectedLocation] = useState(/.*/ );
  const [loadingPage,setLoadingPage] = useState(false)

  const [songs, setSongs] = useState();
  const [playlists, setPlaylists] = useState();

  useEffect(()=>{
    setTimeout(()=>{
    setLoadingPage(true)
    }
    ,1500)
    },[])
    

 /* const forcedId =  []
  currentFarmersToDisplay.forEach((item,index)=>{
  
    forcedId.push({
      ...item,
      id:item.id ? item.id: item._id ? item._id: item.OriginalResponseId ? item.OriginalResponseId:item.name ? item.name: Math.random()
    })
      
  })
  console.log('FORCED ID IS-->',forcedId)*/

  const[farmersFromDB,setFarmersFromDB] = useState([])

  const farmer1 = "https://res.cloudinary.com/deoprtt98/image/upload/v1724863974/farmer8_l3ewpm.png"
  const farmer2 = "https://res.cloudinary.com/deoprtt98/image/upload/v1724863990/farmer2_icjojq.png"
  const farmer3 = "https://res.cloudinary.com/deoprtt98/image/upload/v1724863997/farmer5_ip0m4q.png"
  const farmer4 = "https://res.cloudinary.com/deoprtt98/image/upload/v1724863998/farmer7_zsvpiv.png"
  const farmer5 = "https://res.cloudinary.com/deoprtt98/image/upload/v1724863996/farmer3_ngfl1i.png"
  const farmer6 = "https://res.cloudinary.com/deoprtt98/image/upload/v1724866493/farmer1_ijfjvu.png"
  const farmer7 = "https://res.cloudinary.com/deoprtt98/image/upload/v1724866568/farmer10_bnpjqc.png"
  const farmer8 = "https://res.cloudinary.com/deoprtt98/image/upload/v1724866571/farmer9_l6pqj5.png"
  const farmer9 = "https://res.cloudinary.com/deoprtt98/image/upload/v1724866573/farmer4_mp8ffo.png"
  const farmer10 = "https://res.cloudinary.com/deoprtt98/image/upload/v1724866573/farmer6_fnwxhj.png"

  useEffect( () => {
    const fetchData = async () => {
      try {
          // const snapshot = await db.collection("uploads").get();
          const snapshot2 = await db.collection("playlists").get();
          // const items = snapshot.docs.map((doc) => ({
          //   id: doc.id,
          //   ...doc.data(),
          // }));
          const items2 = snapshot2.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // console.log(items, items2);
          // setSongs(items)
          // console.log(songs);
          setPlaylists(items2);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };

    fetchData();
    dispatch(fetchAllSongs())
  }, [] )



  // useEffect(() => {
  //   /*THIS USE EFFECT IS IMPORTANT TO ASSGIN AN ID SO MUI DATA GRID WILL ACCEPT THE DATA */
  // const forcedId =  []
  // currentFarmersToDisplay && currentFarmersToDisplay.forEach((item,index)=>{
  
  //   forcedId.push({
  //     ...item,
  //     index:index,
  //     id:item.id ? item.id: item._id ? item._id: item.OriginalResponseId ? item.OriginalResponseId:item.name ? item.name: Math.random()
  //   })
      
  // })

  // setFarmersFromDB(forcedId)

 

  // }, [currentFarmersToDisplay])






//useEffect(()=>{
//  /**THIS USE EFFECT IS FOR INITIAL LOAD, USUALLY AFTER LOGIN, WITHOUT HAVING SELECTED A PAGE */
//if(!page){
//  dispatch(sectionFarmersFromPage(1,allFarmers,filteredFarmers,"farmers"))
//}
//else{
//  dispatch(sectionFarmersFromPage(page,allFarmers,filteredFarmers,"farmers"))
//}
//
//
//
//},[page,selectedClass,selectedLocation,selectedSection])




// useEffect(()=>{
//   /**THIS USE EFFECT IS TO CLEAR UP FILTERS ANYTIME THE PAGE IS RELOADED, FOR A FRESH START */
//   /**THIS USE EFFECT HAS TO BE BELOW THE PAGE ONE SO THAT */
     
//         // dispatch(sectionFarmersFromPage(1,[],allFarmers))
//    /*  return ()=>{
//       dispatch(saveCurrentCropTypeFilter());
//         dispatch(saveCurrentLocationFilter());
//         dispatch(saveCurrentCropFilter());
//       dispatch(saveCurrentFarmersToDisplay(allFarmers && allFarmers  ))
//       dispatch(saveFilteredFarmers(allFarmers && allFarmers ))
//          dispatch(saveTotalPagesFarmers(Math.ceil(allFarmers.length/10)))
//          console.log('FARMERS CLEARED UP!');
//       }*/
//     },[])




  const [selectedOption, setSelectedOption] = useState('');
  const [activeButton, setActiveButton] = useState('viewStudents');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleViewStudentsClick = () => {
    setActiveButton('viewStudents');
 
  };

  const handleAddStudentsClick = () => {
    setActiveButton('addStudents');
  };

  return (
    <>

     <Helmet>
        <title> Audiovybez </title>
      </Helmet>

{/*totalPagesFarmers < 0  || !loadingPage?
     <center style={{display:"flex",justifyContent:"center",alignItems:"center",height:"90vh"}}>
      <CircularProgress/>
     </center>
  :*/
      <Container maxWidth="xl" style={{scale:"0.9",position:"relative",top:"-5rem",left:"-2rem"}} >
      
   
     <Grid container spacing={2} alignItems="center" justifyContent="flex-start" style={{display:"flex",alignItems:"flex-start",justifyContent:"flex-start",marginTop:"0.3rem",paddingRight:"0rem"}}> 
       
  <Grid item xs={12} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>

<div style={{display:"flex", justifyContent: "space-between", width: "100%", alignItems: "center"}}>

  <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"flex-start"}}>
    <h1 style={{fontWeight:"700",marginBottom:"0rem", fontSize: "18px", borderBottom: "2px solid #DC2B8C", marginBottom: "2px"}}>NEWSLETTERS</h1>
    <div style={{ minWidth: "400px" }}>View and manage all newsletters</div>
  </div>

    <Grid container spacing={2} alignItems="center" justifyContent="flex-end" style={{display:"flex",alignItems:"flex-end",justifyContent:"flex-end",paddingRight:"0rem"}}> 
          
          <Grid item  style={{width:"max-content",display: 'flex',justifyContent:"flex-start", alignItems: 'flex-start', marginTop: "1.5rem", marginBottom: "2rem",borderRadius:"2rem",padding:"0.5rem" }}>
         
              <Box sx={{ width: '100%', marginTop: '0%'}}>
                <SmallCustomSearchBar   title={"Search Newsletters"} functionality={"farmers"} />
              </Box>
           </Grid>

          
             <Grid item  style={{width:"max-content",display: 'flex',justifyContent:"flex-start", alignItems: 'flex-start', marginTop: "1.5rem", marginBottom: "2rem",backgroundColor:"#F9F9F9",borderRadius:"2rem",padding:"0.5rem" }}>
             

               <Box sx={{ width: '100%'}}>
            
                 <Button
                   variant={'contained'}
                   style={{
                     minHeight: '50px',
                     minWidth: '140px',
                    // backgroundColor: '#21712E',
                      backgroundColor: '#FFFFFF',

                     color: 'black',
                     border: '1px solid black',
                     fontWeight:"400",
                     fontSize:"1.3rem",
                     borderRadius: '5px',
                     marginRight: '-10px',
                   }}
                   
                 >
                  <CiFilter  style={{marginRight:"0.5rem"}}/>
                  Filters
                 </Button>
   
               </Box>
   
            
             </Grid>



          </Grid>

</div>

</Grid>

          </Grid>
        
          

          
          <br/>
          <br/>
           <br/>
          


          <Grid item xs={12} md={12} lg={12}  sx={{maxHeight:"400px"}}>
           <div style={{background: 'white', padding: '10px',paddingLeft:"0",paddingRight:"0",marginTop:"-2.5rem",width:"100%"}}>

           
              
                {/**here 2 */}
                  <Grid container spacing={2} sx={{ padding: '10px'}}>
            
            </Grid>

        
            {/*here */}



        { 
        
       allSongs && allSongs.length > 0 ?
          // <SongsStatsLong  farmers={farmersFromDB}/> 
          <SongsTable jobs={ allSongs && allSongs } />
          :
          <center style={{marginTop:"6rem"}}>
           No Newsletters To Display
          </center>
          }
           </div>
           </Grid>
 

           <Grid item xs={12} md={12} lg={12}  sx={{maxHeight:"400px"}}>
           <div style={{background: 'white', padding: '10px',paddingLeft:"0",paddingRight:"0",marginTop:"8.5rem",width:"100%"}}>

           
              
                {/**here 2 */}
                  <Grid container spacing={2} sx={{ padding: '10px'}}>
                  {<Grid item xs={3} sx={{mb: 0}}>
                  <h1 style={{fontWeight:"700",marginBottom:"0rem",  fontFamily: "inter", fontWeight: "bold", fontSize: "18px", display: "inline-block", borderBottom: "2px solid #DC2B8C", marginBottom: "2px"}}>NEWSLETTERS</h1>
                 </Grid>}


            </Grid>

        
            {/*here */}

      

        { 
        
        playlists && playlists.length > 0 ?
          // <MediaStatsLong  farmers={farmersFromDB}/> 
          <PlaylistTable jobs={ playlists } />
          :
          <center style={{marginTop:"6rem"}}>
          No Newsletters To Display
          </center>
          }
          </div>
          </Grid>



           <Grid item xs={12} md={12} lg={12}  sx={{maxHeight:"400px"}}>
           <div style={{background: 'white', padding: '10px',paddingLeft:"0",paddingRight:"0",marginTop:"1rem",width:"100%"}}>

           
              
                {/**here 2 */}
                  <Grid container spacing={2} sx={{ padding: '10px'}}>
                  {<Grid item xs={3} sx={{mb: 0}}>
                  <h1 style={{fontWeight:"700",marginBottom:"0rem",  fontFamily: "inter", fontWeight: "bold", fontSize: "18px", display: "inline-block", borderBottom: "2px solid #DC2B8C", marginBottom: "2px", marginTop: "148px"}}>ALBUMS</h1>
                 </Grid>}


            </Grid>

        
            {/*here */}

      

        { 
        
        songs && songs.length > 0 ?
        // <SongsStatsLong  farmers={farmersFromDB}/> 
        <SongsTable jobs={ songs } />
        :
        <center style={{marginTop:"6rem"}}>
         No Newsletters To Display
        </center>
        }
         </div>
         </Grid>


      </Container>





    }


    </>
  );
}
