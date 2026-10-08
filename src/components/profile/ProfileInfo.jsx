export default function ProfileInfo(){
    return(
    <div className = "text-tx-white container-page mt-[2.25rem] flex flex-col gap-y-[1.5rem] text-xs font-semibold w-[55rem] item-start mx-0"> 
        <div className="flex flex-col gap-y-[1.125rem]">
            <div className="flex flex-col gap-y-[0.5rem]">
                <label htmlFor="full-name">Full name</label>
                <input id="full-name" type="text"  className="form-input-custom  "/>

            </div>
            <div className="flex flex-col gap-y-[0.625rem]">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" className="form-input-custom "/>
                <p className="text-tx-gray">Set at registration and cannot be changed</p>
            </div>
        </div>

        <div className="flex flex-col gap-y-[1.25rem]">
            <div className="flex flex-col gap-y-[0.5rem]">
                <label htmlFor="phone-number">Mobile Number</label>
                <input id="phone-number" type="tel" className="form-input-custom  "/>

            </div>
            <div className="flex flex-col gap-y-[0.5rem]">
                <label htmlFor="dob">Date of birth</label>
                <input id="dob" type="date" className="form-input-custom "/>

            </div>
            <div className="flex flex-col gap-y-[0.5rem]">
                <label htmlFor="preferred-venue">Prefered Venue</label>
                <input id="preferred-venue" type="text" className="form-input-custom "/>

            </div>
        </div>
        

        
    </div>
    )



}