import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
import { ChangeEvent } from "react";
import { useAppSelector } from "../redux/hooks";

const Form = () => {
    const addressStore = useAppSelector((state) => state.address)


    const onChangeTextHandrler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    }

    return (
        <FormControl style={{ width: 300, marginBottom: 50 }}>
            <InputLabel htmlFor="adress">Откуда</InputLabel>
            <Input
                onChange={onChangeTextHandrler}
                id="address"
                aria-describedby="helper-text"
            />
            <FormHelperText id="helper-text">Также можете поставить метку на карте.</FormHelperText>
        </FormControl>
    )
}

export default Form