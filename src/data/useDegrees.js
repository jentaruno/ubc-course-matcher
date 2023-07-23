import axios from "axios";
import * as cheerio from "cheerio";
import {useEffect, useState} from "react";
import {SERVER_LINK} from "./utils";

export default function useDegrees() {
    const [degrees, setDegrees] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${SERVER_LINK}/api/degrees`;
                const response = await axios.get(url);
                const $ = cheerio.load(response.data);
                const listDegrees = $("td a");
                const degreesArray = [];
                listDegrees.each((i, e) => {
                    degreesArray.push($(e).text());
                });
                setDegrees(degreesArray);
            } catch (error) {
                console.error('Error fetching data:', error);
                setDegrees(null);
            }
        };

        fetchData();
    }, []);

    return degrees;
}