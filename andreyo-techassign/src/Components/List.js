import { React } from 'react'
import data from "./ListData.json"

function List(props) {
    const filteredData = data.filter((data) => {
        if (props.input === '') {
            return data;
        }
        else {
            return data.f_name.toLowerCase().includes(props.input) || data.l_name.toLowerCase().includes(props.input);
        }
    })
    return (
        <ul>
            {filteredData.map((item) => (
                <li key={item.id}>{item.f_name} {item.l_name} , {item.salary}</li>
            ))}
        </ul>
    )
}

export default List