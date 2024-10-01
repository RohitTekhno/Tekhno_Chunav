import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import axios from 'axios';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';
import DropdownSelector from './DropdownSelector';
import VoterListSection from './VoterListSection';

export default function TBVotersPDF() {
  const [townOpen, setTownOpen] = useState(false);
  const [boothOpen, setBoothOpen] = useState(false);

  const [townValue, setTownValue] = useState(null);
  const [boothValue, setBoothValue] = useState(null);

  const [towns, setTowns] = useState([]);
  const [booths, setBooths] = useState([]);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [loadingTowns, setLoadingTowns] = useState(true);
  const [loadingBooths, setLoadingBooths] = useState(false);
  const [loadingVoters, setLoadingVoters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://192.168.200.23:8000/api/towns/')
      .then(response => {
        const townsData = response.data.map(town => ({
          label: `${town.town_id} - ${town.town_name}`,
          value: town.town_id
        }));
        setTowns(townsData);
        setLoadingTowns(false);
      })
      .catch(error => {
        Alert.alert("Error", "Failed to load towns");
        setLoadingTowns(false);
      });
  }, []);

  useEffect(() => {
    if (townValue) {
      setLoadingBooths(true);
      axios.get(`http://192.168.200.23:8000/api/booths_by_town/${townValue}`)
        .then(response => {
          const boothsData = response.data.map(booth => ({
            label: `${booth.booth_id} - ${booth.booth_name}`,
            value: booth.booth_id
          }));
          setBooths(boothsData);
          setLoadingBooths(false);
        })
        .catch(error => {
          Alert.alert("Error", "Failed to load booths");
          setLoadingBooths(false);
        });
    }
  }, [townValue]);

  useEffect(() => {
    if (boothValue) {
      setLoadingVoters(true);
      axios.get(`http://192.168.200.23:8000/api/get_voters_by_booth/${boothValue}`)
        .then(response => {
          setVoters(response.data);
          setFilteredVoters(response.data);
          setLoadingVoters(false);
        })
        .catch(error => {
          Alert.alert("Error", "Failed to load voters");
          setLoadingVoters(false);
        });
    }
  }, [boothValue]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = voters.filter(voter =>
      voter.voter_name.toLowerCase().includes(query.toLowerCase()) ||
      voter.voter_id.toString().includes(query)
    );
    setFilteredVoters(filtered);
  };

  return (
    <HeaderFooterLayout headerText="Family">
      <DropdownSelector
        townOpen={townOpen}
        townValue={townValue}
        towns={towns}
        setTownOpen={setTownOpen}
        setTownValue={setTownValue}
        boothOpen={boothOpen}
        boothValue={boothValue}
        booths={booths}
        setBoothOpen={setBoothOpen}
        setBoothValue={setBoothValue}
        loadingTowns={loadingTowns}
        loadingBooths={loadingBooths}
        onChangeTown={() => setBoothValue(null)}
      />

      <VoterListSection
        voters={voters}
        filteredVoters={filteredVoters}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
      />
    </HeaderFooterLayout>
  );
}
