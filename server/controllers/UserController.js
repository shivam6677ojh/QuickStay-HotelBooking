// get/api/users

export const userData = async (req,res) => {
    try {
        const user = req.user;
        return res.status(200).json({
            success: true,
            clerkId: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            recentSearchedCites: user.recentSearchedCites
        })
    } catch (error) {
        return res.status(500).json({success:false, message:"Server Error"})
    }
}


// store user Recent searcher cites

export const storeRecentSearches = async (req,res) => {
    try {

        const { recentSearchedCity } = req.body;
        const  user  = req.user;
        
        if(user.recentSearchedCites.length < 3){
            user.recentSearchedCites.push(recentSearchedCity);
        }else{
            user.recentSearchedCites.shift();
            user.recentSearchedCites.push(recentSearchedCity);
        }

        await user.save();
        return  res.
        status(200)
        .json({success:true, message:"Recent searched city updated", recentSearchedCites: user.recentSearchedCites});


    } catch (error) {
        res
        .status(500)
        .json({success: false , message: error.message});
    }
};