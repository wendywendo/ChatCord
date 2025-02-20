/* eslint-disable react/prop-types */
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';  
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/UserContext';


function EditRoomDialog({ open, setOpen, admin, members, setRooms, users, fetchRooms }) {

    const handleClose = () => {
        setOpen(false);
    };

    const { activeRoom, user, setActiveRoom } = useAuth()

    const [roomName, setRoomName] = useState(activeRoom)
    const [selectedOptions, setSelectedOptions] = useState({});


    const updateRoom = async () => {
        try {

            if (activeRoom === roomName) {
                return toast.error("Room name is the same");
            }
            
            const {data} = await axios.put('/rooms/update', {
                oldName: activeRoom,
                newName: roomName
            })

            if (data.error) {
                toast.error(data.error)
                return
            }

            setActiveRoom(roomName)
            toast.success("Successfully updated")
            setRooms(prevRooms => 
                prevRooms.map(room => 
                    room.name === activeRoom ? { ...room, name: roomName } : room
                )
            );

        } catch (error) {
            console.log(error)
        }
    }

    const deleteRoom = async () => {
        try {

            if (confirm(`Are you sure you want to delete the room ${activeRoom}?`)) {
            
                const { data } = await axios.delete(`/rooms/delete`, {
                    params: { name: activeRoom }
                });

                if (data.error) {
                    toast.error(data.error)
                    return null
                }

                toast.success("Room successfully deleted!")
                handleClose()
                setRooms(prevRooms => prevRooms.filter(room => room.name !== activeRoom));
                setActiveRoom('')
            }

        } catch (error) {
            console.log(error)
        }
    }

    const addMemberToRoom = async (e, roomName) => {
        e.preventDefault()

        const {data} = await axios.post('/rooms/addMember', {
            roomName,
            userEmail: selectedOptions[roomName]
        })

        if (data.error) {
            toast.error(data.error)
            return
        }

        toast.success('Member successfully added to room')
        fetchRooms()

        // Reset selection
        setSelectedOptions(prev => ({
            ...prev,
            [roomName]: ''
        }));
    }

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    { activeRoom }
                </Typography>
            </Toolbar>
        </AppBar>
        <List>
            <ListItem>
                <TextField
                    label="Room Name"
                    variant="outlined"
                    fullWidth
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                {
                    user.username === admin && (
                        <Button onClick={updateRoom}>Update</Button>
                    )
                }
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary="Admin" secondary={admin || 'Loading...'} />
            </ListItem>
            <Divider />

            <ListItem>
                <ListItemText primary="Members" />
            </ListItem>

            
            { members && members.length > 0 ? (
                members.map((member, index) => (
                    <ListItem key={index}>
                        <ListItemText secondary={member} />
                    </ListItem>
                ))
            ) : (
                <ListItem>
                    <ListItemText secondary="Loading..." />
                </ListItem>
            )}

            <Divider />
            {user.username === admin && (
                <ListItem>
                    <form onSubmit={(e) => addMemberToRoom(e, activeRoom)} className="rooms-add-member-form">
                        <select
                            value={selectedOptions[activeRoom] || ''}
                            onChange={(e) => setSelectedOptions((prev) => ({
                                ...prev,
                                [activeRoom]: e.target.value,
                            }))}
                            className="rooms-select"
                        >
                            <option value=''>Select user</option>
                            {users.map((user) => (
                                <option key={user.email} value={user.email}>{user.username}</option>
                            ))}
                        </select>
                        <Button type="submit" variant="contained" color="primary">
                            ADD MEMBER
                        </Button>
                    </form>
                </ListItem>
            )}

            <Divider />
            {user.username === admin && (
                <ListItem>
                    <Button variant="contained" color="error" fullWidth 
                        onClick={() => deleteRoom()}
                    >
                        Delete Room
                    </Button>
                </ListItem>
            )}
        </List>
    </Dialog>
  )
}

export default EditRoomDialog