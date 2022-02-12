
import classes from './app.module.css'
import {useState} from 'react';
import searchIcon from './search.png';

function App() {
  const recentWords =[];
  const [searchKey, setsearchKey] = useState();
  const [words, setwords] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [result, setresult] = useState("Search any word to show results");
  const [error, seterror] = useState(null);
  function getWords(){
    setisloading(true);
    seterror(null);
    setwords([]);
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchKey}`)
            .then(result => {
              if(!result.ok){
                seterror(true);
                setisloading(false);
                
              }
            return result.json();
            }).then(data =>{
              if(data.length>0){
                setresult(`${data.length} results found.`);
                setwords(data) ;
                setisloading(false);
              }else{
                setresult(`No results found.`);
              }
             
             console.log(data);
            })
  }
  const updateSearchKey =(e)=>{
    setsearchKey(e.target.value);
  }
  
  
 const showMeanings = words.map((meaning, index)=>{
  const audios= meaning.phonetics.map(mp3=><audio controls>  
  <source src={mp3.audio} type="audio/ogg" />Your browser does not support the audio element.
  </audio>
 )
 const wordDetails = meaning.meanings.map(mean=>{
  const wordDefinitions = mean.definitions.map(item =>{
    const wordSynonyms = item.synonyms.map(synonym => <span className={classes.meaningWordDefinitionSynonyms}>{synonym} , </span> )
    const wordAntonyms = item.antonyms.map(antonym => <span className={classes.meaningWordDefinitionAntonyms}>{antonym} , </span> )
  return <div className={classes.meaningWordDefinition}>
    {item.definition  && <span>{item.definition} , </span>} 
    {item.example  && <p className={classes.meaningWordDefinitionExample}><b>Example: </b>{item.example} </p>} 
    {item.synonyms.length>0  && <p><b>Synonyms: </b>{wordSynonyms} ,</p>} 
    {item.antonyms.length>0  && <p><b>Antonym: </b>{wordAntonyms} ,</p>} 
  </div>})

  

 return (<div className={classes.meaningWordwordDefinition}>
  {mean.partOfSpeech && <p className={classes.meaningWordPartOfSpeech}><b>Part Of Speech:</b> {mean.partOfSpeech}</p>} 
  {wordDefinitions}
  
</div>)});
 
return<>
<div>
 <hr/>
   <h2 className={classes.meaningWord}>{index+1}. {meaning.word}</h2> 
     {audios}
     {meaning.origin && <p className={classes.meaningWordOrigin}><b>Origin:</b> {meaning.origin}</p>} 
    {wordDetails}
    
 </div> 
</>
});
  const errorText = <p>Something Went Wrong</p>;
  const resultText = <p className={classes.resultInfo}>{result}</p>;
  const loading= <div className={classes.spinner}></div>
  console.log(recentWords)
  const recentWordSuggents = recentWords.map((recentWord,index)=>{
    return <p>{recentWord}</p>
  })
  return (
    <>
    <div className={classes.header}>
    <h1 className={classes.headerText}>Dictionary app</h1>
    </div>
    <div className={classes.inputArea}>
    <input className={classes.inputBox} value={searchKey} onChange={updateSearchKey} placeholder='type word to search'></input>
    <button className={classes.submitInputButton} onClick={getWords}><img src={searchIcon}/></button>
    </div>
    <div className={classes.ResultBox}>
      {isloading && loading}
      {error && errorText}
      {!error && resultText}
      
      {showMeanings}
    </div>
      
    </>
  );
}

export default App;
