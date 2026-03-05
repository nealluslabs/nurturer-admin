import React, { useState,useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getAdminSettings, simulateCronJob, updateAllContacts, /*updateHolidayMessagesToSent,*/ updateSettingsForAdminSettings, updateTriggerDaysForAllContacts } from "src/redux/actions/group.action";
import { Box, Typography, TextField, Chip } from "@mui/material";




export default function SettingsPage() {

  const dispatch = useDispatch()
  const { adminSettings } = useSelector((state) => state.group);

  const [holidayInput, setHolidayInput] = useState("");
  const [holidays, setHolidays] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && holidayInput.trim() !== "") {
      e.preventDefault();

      if (!holidays.includes(holidayInput.trim())) {
        setHolidays([...holidays, holidayInput.trim()]);
      }

      setHolidayInput("");
    }
  };

  const handleDelete = (holidayToDelete) => {
    setHolidays(holidays.filter((h) => h !== holidayToDelete));
  };
 
 

  const [emailQuery, setEmailQuery] = useState(`I want to send five articles to a business contact. Search the internet for five legitimate,real articles that were written in 2025
  along with a url to that article that can be publicly accessed from these websites - PWC, Deloitte, McKinsey,
   Visitage, Gallup, Josh Bersin, Harvard Business Review and Forbes.
    Provide the title of the articles and the url
    to them. I want articles that are relevant to the contacts info - {$JobTitle}, {$Company}, {$Industry}, {$Interests}.
 Generate an email subject of 5 words maximum with and 3 really short paragraphs of text and fill in this object and 
 return it as your answer(keep the object in valid JSON). Put an emoji at the end of the subject. Make sure the property
  messageStatus is in the JSON object, and it has a value of Pending .
 For the id in each object of the bulletPoints array, please keep the id in the object below, do not delete them when 
 generating your own object.
 {"subject":" ",  
    messageType:"Email",  
    "messageStatus":"Pending" 
     "firstParagraph":" ",  
    "secondParagraph":" ", 
         "thirdParagraph":" ",   
      "bulletPoints":[ 
              {         "bulletPointBold":" ",         "bulletPointRest":" ",         "link":" ",         "id":"0",        },
              {          "bulletPointBold":" ",          "bulletPointRest":" ",          "link":" ",          "id":"1",        },
              {          "bulletPointBold":" ",          "bulletPointRest":" ",          "link":" ",          "id":"2",        },
              {          "bulletPointBold":" ",          "bulletPointRest":" ",          "link":" ",          "id":"3",        },
              {          "bulletPointBold":" ",          "bulletPointRest":" ",          "link":" ",          "id":"4",        },      ]     }
 The first paragraph should be a professional greeting paragraph for an email to a business contact.
  Don't start the paragraph with Dear {$Name}, just jump into the writing. Second paragraph should be 
  about how you have found some articles that relate to their industry {$Industry}.
   The third paragraph should be about how you'd love to hear from them and you wish them luck in their future endeavors and hobbies: {$Interests}.
     For each article, put it's title into "bulletPointBold", it's source into "bulletPointRest" and a link to the article into "link".
      Make each paragraph relevant to the user's job: {$JobTitle}, company:{$Company}, industry:{$Industry} and interests:{$Interests}.
       Please go through the javascript object {$JSON.stringify(previousMessage)}, and try to adapt to my writing style,so you can sound like me,when providing your answer`
 );


  const [eventQuery, setEventQuery] = useState(`I want to send five articles to a business contact. Search the internet for five legitimate,real articles that were written in 2025
  along with a url to that article that can be publicly accessed from these websites - PWC, Deloitte, McKinsey,
   Visitage, Gallup, Josh Bersin, Harvard Business Review and Forbes.
    Provide the title of the articles and the url
    to them. I want articles that are relevant to the contacts info - {$JobTitle}, {$Company}, {$Industry}, {$Interests}.
 Generate an email subject of 5 words maximum with and 3 really short paragraphs of text and fill in this object and 
 return it as your answer(keep the object in valid JSON). Put an emoji at the end of the subject. Make sure the property
  messageStatus is in the JSON object, and it has a value of Pending .
 For the id in each object of the bulletPoints array, please keep the id in the object below, do not delete them when 
 generating your own object.
 {"subject":" ",  
    messageType:"Email",  
    "messageStatus":"Pending" 
     "firstParagraph":" ",  
    "secondParagraph":" ", 
         "thirdParagraph":" ",   
      "bulletPoints":[ 
              {         "bulletPointBold":" ",         "bulletPointRest":" ",         "link":" ",         "id":"0",        },
              {          "bulletPointBold":" ",          "bulletPointRest":" ",          "link":" ",          "id":"1",        },
              {          "bulletPointBold":" ",          "bulletPointRest":" ",          "link":" ",          "id":"2",        },
              {          "bulletPointBold":" ",          "bulletPointRest":" ",          "link":" ",          "id":"3",        },
              {          "bulletPointBold":" ",          "bulletPointRest":" ",          "link":" ",          "id":"4",        },      ]     }
 The first paragraph should be a professional greeting paragraph for an email to a business contact.
  Don't start the paragraph with Dear {$Name}, just jump into the writing. Second paragraph should be 
  about how you have found some articles that relate to their industry {$Industry}.
   The third paragraph should be about how you'd love to hear from them and you wish them luck in their future endeavors and hobbies: {$Interests}.
     For each article, put it's title into "bulletPointBold", it's source into "bulletPointRest" and a link to the article into "link".
      Make each paragraph relevant to the user's job: {$JobTitle}, company:{$Company}, industry:{$Industry} and interests:{$Interests}.
       Please go through the javascript object {$JSON.stringify(previousMessage)}, and try to adapt to my writing style,so you can sound like me,when providing your answer`);

  const [holidayQuery, setHolidayQuery] = useState( `Generate an email subject of 5 words maximum,wishing the user a Happy Fourth of July, and 3 really short paragraphs of text, and fill in this object and return it as your answer(keep the object in valid JSON).For the id in each object of the bulletPoints array, please keep the id in the object below,do not delete them when generating your own object.Finally for the subject, make sure to put an emoji at the end of the generated subject:
  {"subject":"Happy Fourth ofJuly",
  messageType:"Event",
  "messageStatus":"Pending"
   "firstParagraph":" ",
   "secondParagraph":" ",
   "thirdParagraph":" ",
   "bulletPoints":[
     {
      "bulletPointBold":" ",
      "bulletPointRest":" ",
      "link":" ",
      "id":"0",
     },{
       "bulletPointBold":" ",
       "bulletPointRest":" ",
       "link":" ",
       "id":"1",
     },{
       "bulletPointBold":" ",
       "bulletPointRest":" ",
       "link":" ",
       "id":"2",
     },{
       "bulletPointBold":" ",
       "bulletPointRest":" ",
       "link":" ",
       "id":"3",
     },{
       "bulletPointBold":" ",
       "bulletPointRest":" ",
       "link":" ",
       "id":"4",
     },
   ]
  } .The first paragraph should be about how you wish the receiver and everyone at their company,:{$Company} a happy fourth of July.
      Don't start the paragraph with Dear {$Name}, just jump into the writing.
     second parargaph should be about how you are grateful for all the work they do in their industry: {$Industry}. Add a sentimental touch at this point.
     Also mention how you hope they can get a well deserved break today, and maybe even dabble in their interests: {$Interests}.
     The third Paragraph should be thanking them once again for the difference they make and wishing them  happy holidays.
     The Subject should be composed from the content of the paragraphs above and should have some sort of "Happy Fourth of July" phrase in it.
    in the JSON object you generate, there is no need to fill out the bulletPoints array, return the bulletPoints array as it is in the text above.
 
 Please go through the javascript object {$JSON.stringify(previousMessage)}, and try to adapt to my writing style,so you can sound like me,when providing your answer`);



 const [birthdayQuery, setBirthdayQuery] = useState( `Generate an email subject of 5 words maximum,wishing the user a Happy Birthday, and 3 really short paragraphs of text, and fill in this object and return it as your answer(keep the object in valid JSON).For the id in each object of the bulletPoints array, please keep the id in the object below,do not delete them when generating your own object.Finally for the subject, make sure to put an emoji at the end of the generated subject:
 {"subject":"Happy Birthday",
 messageType:"Birthday",
 "messageStatus":"Pending"
  "firstParagraph":" ",
  "secondParagraph":" ",
  "thirdParagraph":" ",
  "bulletPoints":[
    {
     "bulletPointBold":" ",
     "bulletPointRest":" ",
     "link":" ",
     "id":"0",
    },{
      "bulletPointBold":" ",
      "bulletPointRest":" ",
      "link":" ",
      "id":"1",
    },{
      "bulletPointBold":" ",
      "bulletPointRest":" ",
      "link":" ",
      "id":"2",
    },{
      "bulletPointBold":" ",
      "bulletPointRest":" ",
      "link":" ",
      "id":"3",
    },{
      "bulletPointBold":" ",
      "bulletPointRest":" ",
      "link":" ",
      "id":"4",
    },
  ]
 } .The first paragraph should be about how you wish the receiver a happy birthday.
     Don't start the paragraph with Dear {$Name}, just jump into the writing.
    second parargaph should be about how you are grateful for all the work they do in their industry: {$Industry}. Add a sentimental touch at this point.
    Also mention how you hope they can get a well deserved break today, and maybe even dabble in their interests: {$Interests}.
    The third Paragraph should be thanking them once again for the difference they make and wishing them  happy birthday.
    The Subject should be composed from the content of the paragraphs above and should have some sort of "Happy Birthday" phrase in it.
   in the JSON object you generate, there is no need to fill out the bulletPoints array, return the bulletPoints array as it is in the text above.

Please go through the javascript object {$JSON.stringify(previousMessage)}, and try to adapt to my writing style,so you can sound like me,when providing your answer`);


  const [frequency, setFrequency] = useState('7');
  const [loading, setLoading] = useState(false);
  const [loadingCron, setLoadingCron] = useState(false);

  const finalObject ={
    frequency:frequency,
    birthdayQuery:birthdayQuery,
    emailQuery,
    eventQuery,
    holidayQuery,
    holidays
  }



  useEffect(()=>{
dispatch(getAdminSettings())

  },[])


  useEffect(()=>{

    setHolidays(adminSettings && adminSettings.holidays)
    setEmailQuery(adminSettings && adminSettings.emailQuery)
    setEventQuery(adminSettings && adminSettings.eventQuery)
    setHolidayQuery(adminSettings && adminSettings.holidayQuery)
    setBirthdayQuery(adminSettings && adminSettings.birthdayQuery)


  },[adminSettings])


  return (
    <>
      <Box mx={2} pr={4} mt={0.5}>
        <Box sx={{ width: "100%", margin: "2px 0" }}>
          <Typography
            sx={{ 
              fontFamily: "inter", 
              fontWeight: "bold", 
              fontSize: "18px", 
              display: "inline-block", 
              borderBottom: "2px solid #000000" 
            }}
            mb={3}
            px={0.5}
          >SETTINGS</Typography>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '21px' }}>
              <Typography sx={{ minWidth: 120, fontSize: '15px', fontWeight: 500, mt: 1 }}>Email Query:</Typography>
              <textarea 
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                placeholder="Email Query" 
                rows="5"
                style={{ 
                  outline: "none", 
                  width: "100%", 
                  border: "1px solid #000000", 
                  padding: "7px 8px", 
                  fontSize: "14px",
                  resize: "vertical",
                  minHeight: "120px",
                  fontFamily: "inherit"
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '21px' }}>
              <Typography sx={{ minWidth: 120, fontSize: '15px', fontWeight: 500, mt: 1 }}>Event Query:</Typography>
              <textarea 
                value={eventQuery}
                onChange={(e) => setEventQuery(e.target.value)}
                placeholder="Event Query" 
                rows="5"
                style={{ 
                  outline: "none", 
                  width: "100%", 
                  border: "1px solid #000000", 
                  padding: "7px 8px", 
                  fontSize: "14px",
                  resize: "vertical",
                  minHeight: "120px",
                  fontFamily: "inherit"
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '21px' }}>
              <Typography sx={{ minWidth: 120, fontSize: '15px', fontWeight: 500, mt: 1 }}>Birthday Query:</Typography>
              <textarea 
                value={birthdayQuery}
                onChange={(e) => setBirthdayQuery(e.target.value)}
                placeholder="Birthday Query" 
                rows="5"
                style={{ 
                  outline: "none", 
                  width: "100%", 
                  border: "1px solid #000000", 
                  padding: "7px 8px", 
                  fontSize: "14px",
                  resize: "vertical",
                  minHeight: "120px",
                  fontFamily: "inherit"
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '21px' }}>
              <Typography sx={{ minWidth: 120, fontSize: '15px', fontWeight: 500, mt: 1 }}>Holiday Query:</Typography>
              <textarea 
                value={holidayQuery}
                onChange={(e) => setHolidayQuery(e.target.value)}
                placeholder="Holiday Query" 
                rows="5"
                style={{ 
                  outline: "none", 
                  width: "100%", 
                  border: "1px solid #000000", 
                  padding: "7px 8px", 
                  fontSize: "14px",
                  resize: "vertical",
                  minHeight: "120px",
                  fontFamily: "inherit"
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '21px' }}>
              <Typography sx={{ minWidth: 120, fontSize: '15px', fontWeight: 500 }}>Trigger:</Typography>
              <input 
                value={frequency}
                onChange={(e) =>
                  {
            
                   
                  }
                  }
                placeholder="Trigger (Default 7 days)" 
                type="number" 
                style={{ outline: "none", width: "100%", border: "1px solid #000000", padding: "7px 8px", fontSize: "14px" }}
              />
            </Box>



            <Box sx={{ display: "flex", alignItems: "flex-start", marginBottom: "21px" }}>
      
      <Typography sx={{ minWidth: 120, fontSize: "15px", fontWeight: 500 }}>
        Holidays:
      </Typography>

      <Box sx={{ width: "100%" }}>
        
        <TextField
          fullWidth
          placeholder="Type a holiday and press Enter"
          value={holidayInput}
          onChange={(e) => setHolidayInput(e.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
        />

        <Box
          sx={{
            marginTop: "10px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            border:"1px solid black",
            padding:"1rem"
          }}
        >
          {holidays && holidays.map((holiday, index) => (
            <Chip
              key={index}
              label={holiday}
              onDelete={() => handleDelete(holiday)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>

      </Box>
    </Box>



            <Box sx={{ width: "100%",display:"flex",justifyContent:"center",alignItems:"center",gap:"0rem" }}>
              <Box
                sx={{ 
                  background: "#20dbe4", 
                  width: "128px", 
                  margin: "21px auto", 
                  borderRadius: "12px", 
                  cursor: "pointer", 
                  marginTop: "42px", 
                  marginBottom: "42px" 
                }}
                p={1}
              >
                <Typography 
                onClick={()=>{dispatch(updateSettingsForAdminSettings(finalObject))}}
                  sx={{ 
                    textAlign: "center", 
                    color: "white", 
                    fontWeight: "bold", 
                    marginTop: "2px", 
                    fontSize: "14px", 
                    fontFamily: "inter" 
                  }}
                >
                  {loading ? "Loading..." : "SAVE"}
                </Typography>
              </Box>


              <Box
              onClick={()=>{

              if(window.confirm("Are you sure you want to run this operation?")){
              dispatch(simulateCronJob())
              //dispatch(updateAllContacts())
              //dispatch(updateHolidayMessagesToSent())

              }
            }}
                sx={{ 
                  background: "#20dbe4", 
                  width: "128px", 
                  margin: "21px auto", 
                  borderRadius: "12px", 
                  cursor: "pointer", 
                  marginTop: "42px", 
                  marginBottom: "42px" 
                }}
                p={1}
              >
                <Typography 
                  sx={{ 
                    textAlign: "center", 
                    color: "white", 
                    fontWeight: "bold", 
                    marginTop: "2px", 
                    fontSize: "14px", 
                    fontFamily: "inter" 
                  }}
                >
                  {loadingCron ? "Loading..." : "RUN"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
