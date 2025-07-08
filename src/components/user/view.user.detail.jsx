import { Button, Drawer, message, notification } from "antd";
import { useState } from "react";
import { handleUploadFile, updateUserAvatarAPI } from "../../services/api.service";


const ViewUserDetail = (props) => {

    const { isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail, loadUser
    } = props

    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(null)

    const handleOnChangeFile = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            setSelectedFile(null)
            setPreview(null)
            return;
        }

        // I've kept this example simple by using the first image instead of multiple
        const file = event.target.files[0]
        if (file) {
            setSelectedFile(file)
            setPreview(URL.createObjectURL(file))
        }
        console.log(">>check file: ", preview);

    }
    const handleUpdateUserAvatar = async () => {
        // step1: upload file 
        const resUpload = await handleUploadFile(selectedFile, "avatar");
        if (resUpload.data) {
            //success
            const newAvatar = resUpload.data.fileUploaded;
            //step 2: update user
            const resUpdateAvatar = await updateUserAvatarAPI(newAvatar, dataDetail._id, dataDetail.fullName, dataDetail.phone)

            if (resUpdateAvatar.data) {
                setIsDetailOpen(false);
                setSelectedFile(null)
                setPreview(null)
                await loadUser();

                notification.success({
                    message: "Update User avatar",
                    description: "Cật nhật avatar thành công!"
                })
            } else {
                //failed
                notification.error({
                    message: "Error Update File",
                    description: JSON.stringify(resUpdateAvatar.message)
                })
            }

        } else {
            //failed
            notification.error({
                message: "Error Upload File",
                description: JSON.stringify(resUpload.message)
            })
        }

    }

    return (
        <>
            <Drawer
                width={"40vw"}
                title="Chi tiết User"
                onClose={() => {
                    setIsDetailOpen(false);
                    setDataDetail(null)
                }}
                open={isDetailOpen}
            >
                {dataDetail ? <>
                    <p>Id: {dataDetail._id}</p>
                    <br />
                    <p>Full Name: {dataDetail.fullName}</p>
                    <br />
                    <p>Email: {dataDetail.email}</p>
                    <br />
                    <p>Phone: {dataDetail.phone}</p>
                    <br />
                    <p>Avatar:</p>
                    <div style={{
                        marginTop: "10px",
                        height: "100px", width: "150px",
                        border: "1px solid #ccc",
                    }}>
                        <img style={{ height: "100%", width: "100%", objectFit: "contain" }}
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataDetail.avatar}`} />
                    </div>
                    <div>
                        <label htmlFor="btnUpload" style={{
                            display: "block",
                            width: "fit-content",
                            marginTop: "15px",
                            padding: "5px 10px",
                            background: "orange",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}>
                            Upload Avatar
                        </label>
                        <input
                            type="file" hidden id='btnUpload'
                            // onChange={() => { handleOnChangeFile() }} 
                            onChange={(event) => handleOnChangeFile(event)}
                        />
                    </div>

                    {preview &&
                        <>
                            <div style={{
                                marginTop: "10px",
                                marginBottom: "15px",
                                height: "100px", width: "150px",
                            }}>
                                <img style={{ height: "100%", width: "100%", objectFit: "contain" }}
                                    src={preview} />
                            </div>
                            <Button type="primary"
                                onClick={() => handleUpdateUserAvatar()}>Save</Button>
                        </>
                    }
                </>
                    :
                    <>
                        <p>Không có dữ liệu</p>
                    </>
                }
            </Drawer>
        </>

    )
}

export default ViewUserDetail;