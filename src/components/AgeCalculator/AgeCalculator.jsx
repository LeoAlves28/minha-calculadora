import React, { useState } from 'react';
import { differenceInYears, differenceInMonths, differenceInDays, parse } from 'date-fns';
import './AgeCalculator.css';

//Armazenar os valores dos inputs e resultados
const AgeCalculator = () => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [age, setAge] = useState({ days: '--', months: '--', years: '--' });
  const [error, setError] = useState('');

  //Verificar se é bissexto
  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  //Função para calcular
  const calculateAge = () => {
    //Validação
    if (!day || !month || !year) {
      setError('Por favor, preencha todos os campos');
      setAge({days: '--', months: '--', year: '--'});
      return;
    }

    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    //Se != de nº
    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
      setError('Por favor, insira valores numéricos');
      return;
    }

    //29 de fevereiro
    if (monthNum === 2 && dayNum === 29 && !isLeapYear(yearNum)) {
      setError('29 de fevereiro não existe neste ano (não é bissexto)');
      setAge({ days: '--', months: '--', years: '--' });
      return;
    }

    //Data inexistente
    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1 || yearNum > new Date().getFullYear()) {
      setError('Por favor, insira uma data válida');
      return;
    }

    //Data n tem no mês
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    if (dayNum > daysInMonth) {
      setError(`O mês ${monthNum} não tem ${dayNum} dias`);
      return;
    }

    try {
      const birthDate = parse(`${day}-${month}-${year}`, 'dd-MM-yyyy', new Date());
      const today = new Date();

      //Validação: data no futuro
      if (birthDate > today) {
        setError('A data não pode ser no futuro');
        return;
      }

      //Calcular tempo
      const years = differenceInYears(today, birthDate);
      const months = differenceInMonths(today, birthDate) % 12;
      const days = differenceInDays(today, new Date(today.getFullYear(), today.getMonth(), birthDate.getDate()));


      //Atualiza o estado com os resultados
      setAge({
        years: years.toString(),
        months: months.toString(),
        days: days < 0 ? (30 + days).toString() : days.toString()
      });
      setError('');
    } catch (err) {
      setError('Data inválida');
    }
  };

  //Renderizar os componentes
  return (
    //Receber dados
    <div className="age-calculator">
      <h1>Calculadora de Idade</h1>
      <div className="input-fields">
        <div className="input-group">
          <label htmlFor="day">DIA</label>
          <input
            type="text"
            id="day"
            placeholder="DD"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            maxLength="2"
          />
        </div>
        <div className="input-group">
          <label htmlFor="month">MÊS</label>
          <input
            type="text"
            id="month"
            placeholder="MM"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            maxLength="2"
          />
        </div>
        <div className="input-group">
          <label htmlFor="year">ANO</label>
          <input
            type="text"
            id="year"
            placeholder="YYYY"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            maxLength="4"
          />
        </div>
      </div>
      <button onClick={calculateAge}>Calcular Idade</button>
      {error && <p className="error">{error}</p>}
      <div className="result">
        <div className="result-item">
          <span className="result-number">{age.years}</span>
          <span className="result-label">Anos</span>
        </div>
        <div className="result-item">
          <span className="result-number">{age.months}</span>
          <span className="result-label">Meses</span>
        </div>
        <div className="result-item">
          <span className="result-number">{age.days}</span>
          <span className="result-label">Dias</span>
        </div>
      </div>
    </div>
  );
};

export default AgeCalculator;