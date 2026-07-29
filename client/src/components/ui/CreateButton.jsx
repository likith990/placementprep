
import Button from "@mui/material/Button";

export default function CreateButton({openForm}){
    return(
        <>
        <Button
      onClick={openForm}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        fontSize: 14,
        backgroundColor: "#4f46e5",
        borderRadius: "8px",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "#4338ca",
          boxShadow: "none",
        },
      }}
    >
      Create Slot
    </Button>
        </>
    )
}

