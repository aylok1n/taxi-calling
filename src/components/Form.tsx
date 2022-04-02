import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";

const Form = () => {
    return (
        <FormControl style={{ width: 300, marginBottom: 50 }}>
            <InputLabel htmlFor="adress">Откуда</InputLabel>
            <Input id="adress" aria-describedby="helper-text" />
            <FormHelperText id="helper-text">Также можете поставить метку на карте.</FormHelperText>
        </FormControl>
    )
}

export default Form