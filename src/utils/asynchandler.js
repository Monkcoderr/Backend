// const asynchandler = (requesthandler)=> {
//     (req, res, next)=>{
//         Promise.resolve(requesthandler(req, res, next)).catch((err) => next(err))
//     }
// }

// export default asynchandler

const asynchandler = (requesthandler) => {
  return (req, res, next) => {
    Promise.resolve(requesthandler(req, res, next)).catch(next);
  };
};

export default asynchandler;
 