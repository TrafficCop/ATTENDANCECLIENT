import React, {useRef, useState} from 'react'

export default function Entry({entry, type}) {
    let time_in = '';
    let time_out = '';
    let name = ''
    
    if (type === "attendance") {
        if (entry.value !== null) {
            let [t, tout] = entry.value.split("/");
            time_in = t;
            time_out = tout;
            name = entry.person_name;
          }
        

        return (
            <tr>
                <td> {name} </td>
                <td> {time_in} </td>
                <td> {time_out} </td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td className="manage"> {entry.person_name} </td>
            </tr>
        )
    }
}