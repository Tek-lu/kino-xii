export default function venueFormat(venue, filterVenue) {
    let formats = venue.filter((v) => filterVenue
                    .includes(v.slug))
                    .flatMap((v) => v.formats)
    
    let names = []
    return formats.filter((f)=>{
        if (names.includes(f.name)){
            return false
        } 
        else{
            names.push(f.name)
            return true
        }
    })
    
    
}