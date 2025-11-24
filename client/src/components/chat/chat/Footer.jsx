import { useEffect } from 'react';
import { Box, styled, InputBase } from '@mui/material';
import { EmojiEmotions, AttachFile, Mic } from '@mui/icons-material';
import { uploadFile } from '../../../service/api';

const Container = styled(Box)`
    height: 60px;
    background: #ededed;
    width: 97%;
    display: flex;
    align-items: center;
    padding: 0 15px;
    gap: 15px;

    & > * {
        color: #919191;
    }
`;

const Search = styled(Box)`
    background: #ffffff;
    border-radius: 25px;
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 15px;
    height: 40px;
`;

const InputField = styled(InputBase)`
    width: 100%;
    font-size: 14px;
`;

const ClipIcon = styled(AttachFile)`
    transform: rotate(40deg);
`;

const Footer = ({ sendText, setValue, value, file, setFile, setImage }) => {

    useEffect(() => {
    const getImage = async () => {
        if (!file) return; // safe check

        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        try {
            const response = await uploadFile(data);
            setImage(response.data.fileUrl); // ✅ get actual URL
        } catch (err) {
            console.error("Upload error:", err);
        }
    }

    getImage();
}, [file]);
 // ✅ run only when `file` changes

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return; // ✅ handle cancel selection

        setFile(selectedFile);
        setValue(selectedFile.name);
    }

    return (
        <Container>
            <EmojiEmotions />
            <label htmlFor="fileInput">
                <ClipIcon />
            </label>

            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={onFileChange}
            />

            <Search>
                <InputField
                    placeholder="type a message"
                    onChange={(e) => setValue(e.target.value)}
                    onKeyPress={(e) => sendText(e)}
                    value={value}
                />
            </Search>
            <Mic />
        </Container>
    );
};

export default Footer;

