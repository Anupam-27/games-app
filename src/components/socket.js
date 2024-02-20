import socket from "../../socket";

const handleInvitationAccept = ({ tourId, userId, setShowInviteModel, setModelData }) => {
    try {
        console.log(tourId, userId, setShowInviteModel, setModelData, "invitation")
        setShowInviteModel(true)
        setModelData({ tourId: tourId })
    } catch (err) {
        console.error(err)
    }
}

const handleSocketEvents = ({ setShowInviteModel, setModelData }) => {
    try {
        socket.on('invitation', ({ tourId, userId }) => {
            console.log(tourId, userId, "tourId, userId")
            handleInvitationAccept({ tourId, userId, setShowInviteModel, setModelData })
        });

    } catch (err) {
        console.error(err)
    }
}

export default handleSocketEvents