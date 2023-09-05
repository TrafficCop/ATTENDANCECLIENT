import React, {useState} from 'react'
import Entry from './Entry'

export default function EntryList({entries, type}) {
    return (
        entries.map(entry => {
            if (entry.value !== null)
            return <Entry key={entry.person_name} entry={entry} type={type} />
        })
    )
}