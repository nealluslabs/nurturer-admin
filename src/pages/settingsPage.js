import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

export default function SettingsPage() {
  const [emailQuery, setEmailQuery] = useState(`Generate an email subject of 5 words maximum, and 3 really short paragraphs of text and 5 articles to refer to, and fill in this object and return it as your answer(keep the object in valid JSON)Articles should be not be older than {$Frequency},and links for the articles should from these sites only - PWC, Deloitte, McKinsey, Visitage, Gallup, Josh Bersin, Harvard Business Review and Forbes..For the id in each object of the bulletPoints array, please keep the id in the object below,do not delete them when generating your own object.Finally for the subject, make sure to put an emoji at the end of the generated subject:
  {"subject":" ",
  messageType:"Email",
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
  } . The first paragraph should be a professional paragraph about how you are checking in with them and about their role..
      Don't start the paragraph with Dear {$Name}, just jump into the writing.
     second parargaph should be about how you have found some articles that relate to their industry {$Industry}.
     The third paragraph should be about how you'd love to hear from them and you wish them luck in their future endeavors and hobbies: {$Interests}.
     The Subject should be composed from the content of the paragraphs above and should have some sort of "catch up" phrase in it.

  for each article, put in it's title into "bulletPointBold", it's source into "bulletPointRest" and a link to the article into "link"

  make each paragraph relevant to the user's job: {$JobTitle},company:{$Company},industry:{$Industry}  and interests:{$Interests}.Please make sure each article fetched is from this year. Please go through the javascript object {$JSON.stringify(previousMessage)}, and try to adapt to my writing style,so you can sound like me,when providing your answer`
 );
  const [eventQuery, setEventQuery] = useState(`Generate an email subject of 5 words maximum, and 3 really short paragraphs of text and 5 articles to refer to, and fill in this object and return it as your answer(keep the object in valid JSON)Articles should be not be older than {$Frequency},and links for the articles should from these sites only - PWC, Deloitte, McKinsey, Visitage, Gallup, Josh Bersin, Harvard Business Review and Forbes..For the id in each object of the bulletPoints array, please keep the id in the object below,do not delete them when generating your own object.Finally for the subject, make sure to put an emoji at the end of the generated subject:
  {"subject":" ",
  messageType:"Email",
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
  } . The first paragraph should be a professional paragraph about how you are checking in with them and about their role..
      Don't start the paragraph with Dear {$Name}, just jump into the writing.
     second parargaph should be about how you have found some articles that relate to their industry {$Industry}.
     The third paragraph should be about how you'd love to hear from them and you wish them luck in their future endeavors and hobbies: {$Interests}.
     The Subject should be composed from the content of the paragraphs above and should have some sort of "catch up" phrase in it.

  for each article, put in it's title into "bulletPointBold", it's source into "bulletPointRest" and a link to the article into "link"

  make each paragraph relevant to the user's job: {$JobTitle},company:{$Company},industry:{$Industry}  and interests:{$Interests}.Please make sure each article fetched is from this year. Please go through the javascript object {$JSON.stringify(previousMessage)}, and try to adapt to my writing style,so you can sound like me,when providing your answer`);




  
  const [birthdayQuery, setBirthdayQuery] = useState( ` Generate an email subject of 5 words maximum,wishing the user a Happy Birthday, and 3 really short paragraphs of text, and fill in this object and return it as your answer(keep the object in valid JSON).For the id in each object of the bulletPoints array, please keep the id in the object below,do not delete them when generating your own object.Finally for the subject, make sure to put an emoji at the end of the generated subject:
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
  } .The first paragraph should be about how you wish the receiver a happy birthday and a year ahead filled with great moments,not just in relation to their job:{$JobTitle},but in life as well.
      Don't start the paragraph with Dear {$Name}, just jump into the writing.
     second parargaph should be about how you are grateful for all the work they do in their industry: {$Industry}. Add a sentimental touch at this point.
     Also mention how you hope they can get a well deserved break today, and maybe even dabble in their interests: {$Interests}.
     The Subject should be composed from the content of the paragraphs above and should have some sort of "Happy Birthday" phrase in it.
     The third Paragraph should be wishing them future success at their company:{$Company},and then say something witty about their hobby:{$Interests},before finally wishing them success at it.
    in the JSON object you generate, there is no need to fill out the bulletPoints array, return the bulletPoints array as it is in the text above.

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
  const [frequency, setFrequency] = useState('7');
  const [loading, setLoading] = useState(false);

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
              <Typography sx={{ minWidth: 120, fontSize: '15px', fontWeight: 500 }}>Send Date:</Typography>
              <input 
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="Frequency (Default 7 days)" 
                type="number" 
                style={{ outline: "none", width: "100%", border: "1px solid #000000", padding: "7px 8px", fontSize: "14px" }}
              />
            </Box>

            <Box sx={{ width: "100%" }}>
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
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
