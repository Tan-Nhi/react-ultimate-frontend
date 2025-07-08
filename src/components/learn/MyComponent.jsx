// () => {}
//JSX  : 1 parent
//component = html + csss + js
import './style.css'

const MyComponent = () => {
    // const hoidanit = "Crocodile1" //string
    // const hoidanit = 25 //number
    // const hoidanit = true //boolean
    // const hoidanit = undefined;
    // const hoidanit = null;
    const hoidanit = [1, 2, 3] //array 
    // const hoidanit = {
    //     name: "hoidanit",
    //     age: 25,

    // }
    return (
        //fragment (<>)
        <>
            <div > {JSON.stringify(hoidanit)} update</div>
            <div>{console.log("Renekton")}</div>
            <div className="child"
                style={
                    { borderRadius: "10px" }
                }>child</div>
        </>
    );
}

export default MyComponent;