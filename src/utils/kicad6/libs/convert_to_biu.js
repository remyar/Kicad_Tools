const IU_PER_MILS = 1.0;
const IU_PER_MM   = ( IU_PER_MILS / 0.0254 );

function Mils2iu( mils ){
    return mils;
}

export default {
    Mils2iu,
    IU_PER_MILS,
    IU_PER_MM
}