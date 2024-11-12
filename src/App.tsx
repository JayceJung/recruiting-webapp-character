import { useEffect, useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts';

const GITHUB_USERNAME = 'JayceJung'; 
const API_URL = `https://recruiting.verylongdomaintotestwith.ca/api/${GITHUB_USERNAME}/character`;

function App() {
  // Incomplete
  // const [characters, setCharacters] = useState([]);
  // const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  
  const [attribute, setAttribute] = useState({
    'Strength': 10,
    'Dexterity': 10,
    'Constitution': 10,
    'Intelligence': 10,
    'Wisdom': 10,
    'Charisma': 10
  });
  const [selectedClass, setSelectedClass] = useState(null);
  const [skillPointsSpent, setSkillPointsSpent] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [skill, setSkill] = useState({
    'Acrobatics': 0,
    'Animal Handling': 0,
    'Arcana': 0,
    'Athletics': 0,
    'Deception': 0,
    'History': 0,
    'Insight': 0,
    'Intimidation': 0,
    'Investigation': 0,
    'Medicine': 0,
    'Nature': 0,
    'Perception': 0,
    'Performance': 0,
    'Persuasion': 0,
    'Religion': 0,
    'Sleight of Hand': 0,
    'Stealth': 0,
    'Survival': 0
  });
  const [DC, setDC] = useState(10)
  const [selectedSkill, setSelectedSkill] = useState(SKILL_LIST[0].name);
  const [isSuccess, setIsSuccess] = useState(null);
  const [rollResult, setRollResult] = useState(null);

  const checkRequirement = (charClass) => {
    const classRequirements = CLASS_LIST[charClass];
    return ATTRIBUTE_LIST.every(attr => attribute[attr] >= classRequirements[attr]);
  }

  const modifierCalculation = (attribute) => {
    return Math.floor((attribute - 10) / 2);
  }

  const availableSkillPoints = 10 + 4 * Math.floor((attribute['Intelligence'] - 10) / 2);
  
  const adjustAttribute = (attr, amount) => {
    setAttribute((prevAttributes) => {
      const newAttributeValue = prevAttributes[attr] + amount;
      const newAttributes = { ...prevAttributes, [attr]: newAttributeValue };

      let totalPoints = 0;
      for (const key in newAttributes) {
        totalPoints += newAttributes[key];
      }
  
      if (totalPoints > 70) {
        alert("Total attribute points cannot exceed 70.");
        return prevAttributes;
      }
  
      return {
        ...prevAttributes,
        [attr]: Math.max(0, newAttributeValue),
      };
    });
  };

  const adjustSkillPoint = (skill, amount) => {
    setSkill((prevSkill) => {
      const newAttributeValue = prevSkill[skill] + amount;
      const newAttributes = { ...prevSkill, [skill]: newAttributeValue };

      let totalSkillPoints = 0;
      for (const key in newAttributes) {
        totalSkillPoints += newAttributes[key];
      }
  
      if (totalSkillPoints > availableSkillPoints) {
        alert("Total skill points cannot exceed skill point available.");
        return prevSkill; 
      }
      
      setSkillPointsSpent(totalSkillPoints);

      return {
        ...prevSkill,
        [skill]: Math.max(0, newAttributeValue),
      };
    });
  }

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          setLoading(false);
          console.log(data.body);
          if (data.body) {
            setAttribute(data.body.attribute); 
          }
        } else {
          console.error('Failed to fetch character data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCharacterData();
  }, []);

  const saveCharacterData = async () => {

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attribute }),
      });

      if (response.ok) {
        console.log('Character data saved successfully');
      } else {
        console.error('Failed to save character data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // const switchCharacter = (index) => {
  //   setCurrentCharacterIndex(index);
  //   setAttribute(characters[index].attributes);
  // };

  const handleSkillChange = (e) => {
    setSelectedSkill(e.target.value);
  };
  
  const checkSkill = () => {
    const s = SKILL_LIST.find(skill => skill.name === selectedSkill);
    if (s) {
      const attributeModifier = skill[s.name] + modifierCalculation(attribute[s.attributeModifier]) || 0;

      const randomRoll = Math.floor(Math.random() * 20) + 1;

      const totalResult = randomRoll + attributeModifier;
      const success = totalResult >= DC;

      setRollResult(randomRoll);
      setIsSuccess(success);
    }
  };

  const getAttributeModifierForSkill = (skillName)=> {
    const skill = SKILL_LIST.find(skill => skill.name === skillName);
    return skill.attributeModifier;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      {/* <div>
        <h2>Select Character</h2>
        {loading ? (
          <p>Loading characters...</p> 
        ) : (
          <ul>
            {characters.map((char, index) => (
              <li key={index} onClick={() => switchCharacter(index)}>
                Character {index + 1}
              </li>
            ))}
          </ul>
        )}
      </div> */}
      <section className="App-section">
        <h2>Attributes</h2>
        <div className="attributes">
          {ATTRIBUTE_LIST.map((attr) => (
            <div key={attr}>
              <strong>{attr}:</strong> {attribute[attr]}
              <button onClick={() => adjustAttribute(attr, 1)}>+</button>
              <button onClick={() => adjustAttribute(attr, -1)}>-</button>
              <span>Modifier: {modifierCalculation(attribute[attr])}</span>
            </div>
          ))}
        </div>
        <h2>Classes</h2>
        <div className="classes">
          {Object.keys(CLASS_LIST).map((charClass) => (
            <div
              key={charClass}
              onClick={() => setSelectedClass(charClass)}
              style={{
                cursor: 'pointer',
                fontWeight: checkRequirement(charClass)
                  ? 'bold'
                  : 'normal',
                color: checkRequirement(charClass)
                  ? 'green'
                  : 'red',
              }}
            >
              {charClass}
            </div>
          ))}
        </div>
        {selectedClass && (
          <div className="class-requirements">
            <h3>{selectedClass} Requirements</h3>
            <ul>
              {Object.entries(CLASS_LIST[selectedClass]).map(([attr, min]) => (
                <li key={attr}>
                  {attr}: {min} (Your score: {attribute[attr]})
                </li>
              ))}
            </ul>
          </div>
        )}
        <h2>Skills</h2>
        <p>Total Available Points: {availableSkillPoints}</p>
        <p>Total Spent Points: {skillPointsSpent}</p>
        <div className="skills">
          {SKILL_LIST.map((s) => (
            <div key={s.name}>
              <strong>{s.name}:</strong> {skill[s.name]}
              <span> - Modifier: ({s.attributeModifier}): {modifierCalculation(attribute[s.attributeModifier])} </span>
              <button onClick={() => adjustSkillPoint(s.name, 1)}>+</button>
              <button onClick={() => adjustSkillPoint(s.name, -1)}>-</button>
              <span>Total: {skill[s.name] + modifierCalculation(attribute[s.attributeModifier])}</span>
            </div>
          ))}
        </div>
        <button onClick={() => saveCharacterData()}>Save</button>
        <h2>Skill Check</h2>
        <div>
          <select value={selectedSkill} onChange={handleSkillChange}>
            {SKILL_LIST.map((obj) => 
              <option value={obj.name}>{obj.name}</option>
            )}
          </select>
          <input type='number' value={DC} onChange={(e) => setDC(Number(e.target.value))} min="1"/>
          <button onClick={checkSkill}>Roll</button>
        </div>
        {rollResult !== null && (
          <div>
            <p>Roll: {rollResult}</p>
            <p>Total Skill: {skill[selectedSkill] + modifierCalculation(attribute[getAttributeModifierForSkill(selectedSkill)])}</p>
            <p>
              {isSuccess
                ? 'Skill Check: Success!'
                : 'Skill Check: Failure!'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
