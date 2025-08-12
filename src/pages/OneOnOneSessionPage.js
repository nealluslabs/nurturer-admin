import React, { useState, useEffect } from 'react';

import { Box, Typography } from "@mui/material";
import { useDispatch } from 'react-redux';
import { createOneOnOnes } from 'src/redux/actions/group.action';

// Firebase Firestore
import { db } from 'src/config/firebase';

const OneOnOneSessionPage = () => {

    const dispatch = useDispatch();

    const [title, setTitle] = useState();
    const [position, setPosition] = useState();
    const [rate, setRate] = useState();
    const [description, setDescription] = useState();
    const [oneOnOnes, setOneOnOnes] = useState();

    const [editId, setEditId] = useState();
    const [loading, setLoading] = useState(false);

    const dataDispatch = { title, position, rate, description };

    const getOneOnOnes = async () => {
        try {
          const querySnapshot = await db.collection("oneOnOnes").get();
          const onOnes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOneOnOnes(onOnes);
        } catch (error) {
          console.error("Error getting documents:", error);
        }
    };

    const submitData = async () => {
        setLoading(true);
        if(!editId) {
            dispatch( createOneOnOnes(dataDispatch) );
            setTitle(""); setRate(""); setDescription(""); setPosition(""); setLoading(false);
        }
        else { 
            try {
                await db.collection("oneOnOnes").doc(editId).update({
                  title, description, rate, position
                });
                console.log("User updated successfully!");
                setTitle(""); setRate(""); setDescription(""); setPosition("");  setEditId(""); setLoading(false);
              } catch (error) {
                console.error("Error updating user:", error);
                setLoading(false)
              }
        }
    }

    const editData = (item) => {
        setTitle(item.title); setRate(item.rate); setPosition(item.position);
        setDescription(item.description);
        setEditId(item.id);
    }

    useEffect( () => {
        getOneOnOnes();
    }, [] )

    return (
        <>
            <Box mx={2} pr={4} mt={0.5}>
                
                <Box sx={{ width: "70%", margin: "2px auto" }}>
                    <Typography
                        sx={{ 
                            fontFamily: "inter", 
                            fontWeight: "bold", 
                            fontSize: "18px", 
                            display: "inline-block", 
                            borderBottom: "2px solid #DC2B8C" 
                        }}
                        mb={3}
                        px={0.5}
                    >ONE ON ONE SESSIONS</Typography>

                    <Box>
                        <input 
                            value={ title }
                            onChange={ e => setTitle(e.target.value) }
                            placeholder="Title" type="text" 
                            style={{ outline: "none", width: "100%", border: "1px solid #000000", padding: "7px 8px", fontSize: "14px", marginBottom: "21px" }}
                        />

                        <input 
                            value={ position }
                            onChange={ e => setPosition(e.target.value) }
                            placeholder="Position" type="text" 
                            style={{ outline: "none", width: "100%", border: "1px solid #000000", padding: "7px 8px", fontSize: "14px", marginBottom: "21px" }}
                        />

                        <input  
                            value={ rate }
                            onChange={ e => setRate(e.target.value) }
                            placeholder="Rate" type="text" 
                            style={{ outline: "none", width: "100%", border: "1px solid #000000", padding: "7px 8px", fontSize: "14px", marginBottom: "21px" }}
                        />

                        <textarea 
                            value={ description }
                            onChange={ e => setDescription(e.target.value) }
                            placeholder="Description"
                            style={{ outline: "none", width: "100%", height: "250px", border: "1px solid #000000", padding: "7px 8px", fontSize: "14px" }}
                        />

                        <Box sx={{ width: "100%" }}>
                            <Box
                                sx={{ background: "linear-gradient(to right, #E61484, #3E256E)", width: "128px", margin: "21px auto", borderRadius: "12px", cursor: "pointer", marginTop: "42px", marginBottom: "42px" }}
                                p={1}
                                onClick={ () => submitData() }
                            >
                                <Typography 
                                    sx={{ textAlign: "center", color: "white", fontWeight: "bold", marginTop: "2px", fontFamily: "inter", fontSize: "14px" }}
                                >
                                    { loading ? "Loading..." : editId ? "EDIT" : "SUBMIT" }
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Box sx={{ border: "1px solid #DC2B8C" }} mb={3}></Box>

                    { oneOnOnes && oneOnOnes.map( item => (
                        <Box 
                            sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", width: "90%", margin: "14px auto", border: "1px solid black" }}
                            px={6} py={2}
                        >
                            <Box>
                                <Typography sx={{ fontFamily: "inter", fontSize: "14px" }}>{ item.title }</Typography>
                                <Typography
                                    sx={{ fontSize: "12px", fontFamily: "inter" }}
                                >{ item.description }</Typography>
                            </Box>

                            <Box
                                sx={{ background: "linear-gradient(to right, #E61484, #3E256E)",color:"white",/*background: "#DC2B8C",*/ borderRadius: "12px", cursor: "pointer" }}
                                px={4} py={1.5}
                                onClick={ () => editData(item) }
                            >
                                <Typography sx={{ fontFamily: "inter", fontSize: "13px" }}>EDIT</Typography>
                            </Box>
                        </Box>
                    ) ) }
                </Box>
            </Box>
        </>
    )
}

export default OneOnOneSessionPage;
