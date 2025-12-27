"use client";

import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Droplets, Building2, Home, Store, Leaf, Gauge, Search, Filter, Info, AlertTriangle, Users, DoorOpen } from 'lucide-react';

// Complete Muscat Bay Water Network Hierarchy Data with Building → Apartment Structure
const networkData = {
    id: "C43659",
    label: "Main Bulk (NAMA)",
    level: "L1",
    type: "Main_BULK",
    meterCount: 349,
    children: [
        {
            id: "DC",
            label: "Direct Connections",
            level: "L2",
            type: "category",
            meterCount: 11,
            children: [
                { id: "4300334", label: "Hotel Main Building", level: "L2", type: "Retail", alert: true, note: "~50% of total consumption" },
                { id: "4300349", label: "Al Adrak Camp", level: "L2", type: "Retail" },
                { id: "4300348", label: "Al Adrak Company", level: "L2", type: "Retail" },
                { id: "4300340", label: "Irrigation Controller UP", level: "L2", type: "IRR_Services" },
                { id: "4300341", label: "Irrigation Controller DOWN", level: "L2", type: "IRR_Services" },
                { id: "4300323", label: "Irrigation Tank 01 (Inlet)", level: "L2", type: "IRR_Services" },
                { id: "4300294", label: "Irrigation Tank 04 (Z08)", level: "L2", type: "IRR_Services" },
                { id: "4300336", label: "Community Mgmt - Technical Zone, STP", level: "L2", type: "MB_Common" },
                { id: "4300338", label: "Phase 02 Main Entrance", level: "L2", type: "MB_Common" },
                { id: "4300299", label: "Building (ROP)", level: "L2", type: "MB_Common" },
                { id: "4300297", label: "Building (Security)", level: "L2", type: "MB_Common" },
            ]
        },
        {
            id: "4300346",
            label: "Zone FM",
            level: "L2",
            type: "Zone_Bulk",
            zone: "Zone_01_(FM)",
            meterCount: 17,
            children: [
                { id: "4300296", label: "Building FM", level: "L3", type: "MB_Common" },
                { id: "4300310", label: "Building (MEP)", level: "L3", type: "MB_Common" },
                { id: "4300309", label: "Room PUMP (FIRE)", level: "L3", type: "MB_Common" },
                { id: "4300300", label: "Building B1", level: "L3", type: "Retail" },
                { id: "4300301", label: "Building B2", level: "L3", type: "Retail" },
                { id: "4300302", label: "Building B3", level: "L3", type: "Retail" },
                { id: "4300303", label: "Building B4", level: "L3", type: "Retail" },
                { id: "4300304", label: "Building B5", level: "L3", type: "Retail" },
                { id: "4300305", label: "Building B6", level: "L3", type: "Retail" },
                { id: "4300306", label: "Building B7", level: "L3", type: "Retail" },
                { id: "4300307", label: "Building B8", level: "L3", type: "Retail" },
                { id: "4300324", label: "Building CIF/CB", level: "L3", type: "Retail" },
                { id: "4300339", label: "Building CIF/CB (Coffee)", level: "L3", type: "Retail" },
                { id: "4300325", label: "Building Nursery", level: "L3", type: "Retail" },
                { id: "4300298", label: "Building Taxi", level: "L3", type: "Retail" },
                { id: "4300337", label: "Cabinet FM (Contractors)", level: "L3", type: "Building" },
                { id: "4300308", label: "Irrigation Tank (Z01_FM)", level: "L3", type: "IRR_Services" },
            ]
        },
        {
            id: "4300343",
            label: "Zone 3A",
            level: "L2",
            type: "Zone_Bulk",
            zone: "Zone_03_(A)",
            alert: true,
            note: "High loss area - 58% variance",
            meterCount: 101,
            children: [
                {
                    id: "Z3A_VILLAS",
                    label: "Villas (21 units)",
                    level: "L3",
                    type: "category",
                    meterCount: 21,
                    children: [
                        { id: "4300002", label: "Z3-42", level: "L3", type: "Residential_Villa" },
                        { id: "4300005", label: "Z3-38", level: "L3", type: "Residential_Villa" },
                        { id: "4300038", label: "Z3-23", level: "L3", type: "Residential_Villa" },
                        { id: "4300044", label: "Z3-41", level: "L3", type: "Residential_Villa" },
                        { id: "4300049", label: "Z3-37", level: "L3", type: "Residential_Villa" },
                        { id: "4300050", label: "Z3-43", level: "L3", type: "Residential_Villa" },
                        { id: "4300052", label: "Z3-31", level: "L3", type: "Residential_Villa" },
                        { id: "4300075", label: "Z3-35", level: "L3", type: "Residential_Villa" },
                        { id: "4300079", label: "Z3-40", level: "L3", type: "Residential_Villa" },
                        { id: "4300081", label: "Z3-30", level: "L3", type: "Residential_Villa" },
                        { id: "4300082", label: "Z3-33", level: "L3", type: "Residential_Villa" },
                        { id: "4300084", label: "Z3-36", level: "L3", type: "Residential_Villa" },
                        { id: "4300085", label: "Z3-32", level: "L3", type: "Residential_Villa" },
                        { id: "4300086", label: "Z3-39", level: "L3", type: "Residential_Villa" },
                        { id: "4300087", label: "Z3-34", level: "L3", type: "Residential_Villa" },
                        { id: "4300089", label: "Z3-27", level: "L3", type: "Residential_Villa" },
                        { id: "4300091", label: "Z3-24", level: "L3", type: "Residential_Villa" },
                        { id: "4300093", label: "Z3-25", level: "L3", type: "Residential_Villa" },
                        { id: "4300095", label: "Z3-26", level: "L3", type: "Residential_Villa" },
                        { id: "4300097", label: "Z3-29", level: "L3", type: "Residential_Villa" },
                        { id: "4300101", label: "Z3-28", level: "L3", type: "Residential_Villa" },
                    ]
                },
                {
                    id: "Z3A_BLDGS",
                    label: "Buildings (10 units)",
                    level: "L3",
                    type: "category",
                    meterCount: 80,
                    children: [
                        {
                            id: "4300178", label: "D-44 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300030", label: "D-44 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300031", label: "D-44 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300032", label: "D-44 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300033", label: "D-44 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300034", label: "D-44 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300035", label: "D-44 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300144", label: "D-44 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300179", label: "D-45 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300013", label: "D-45 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300017", label: "D-45 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300019", label: "D-45 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300026", label: "D-45 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300110", label: "D-45 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300113", label: "D-45 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300135", label: "D-45 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300180", label: "D-46 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300003", label: "D-46 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300007", label: "D-46 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300011", label: "D-46 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300014", label: "D-46 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300015", label: "D-46 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300043", label: "D-46 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300138", label: "D-46 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300181", label: "D-47 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300012", label: "D-47 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300016", label: "D-47 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300018", label: "D-47 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300039", label: "D-47 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300051", label: "D-47 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300115", label: "D-47 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300143", label: "D-47 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300182", label: "D-48 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300040", label: "D-48 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300041", label: "D-48 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300048", label: "D-48 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300117", label: "D-48 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300123", label: "D-48 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300131", label: "D-48 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300141", label: "D-48 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300183", label: "D-49 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300004", label: "D-49 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300010", label: "D-49 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300053", label: "D-49 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300061", label: "D-49 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300107", label: "D-49 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300108", label: "D-49 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300140", label: "D-49 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300184", label: "D-50 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300021", label: "D-50 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300027", label: "D-50 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300028", label: "D-50 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300047", label: "D-50 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300109", label: "D-50 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300114", label: "D-50 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300136", label: "D-50 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300185", label: "D-51 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300111", label: "D-51 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300112", label: "D-51 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300121", label: "D-51 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300127", label: "D-51 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300128", label: "D-51 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300134", label: "D-51 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300137", label: "D-51 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300177", label: "D-74 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300022", label: "D-74 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300045", label: "D-74 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300046", label: "D-74 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300106", label: "D-74 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300118", label: "D-74 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300125", label: "D-74 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300139", label: "D-74 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300176", label: "D-75 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300006", label: "D-75 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300036", label: "D-75 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300037", label: "D-75 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300055", label: "D-75 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300063", label: "D-75 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300122", label: "D-75 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300145", label: "D-75 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                    ]
                }
            ]
        },
        {
            id: "4300344",
            label: "Zone 3B",
            level: "L2",
            type: "Zone_Bulk",
            zone: "Zone_03_(B)",
            meterCount: 147,
            children: [
                {
                    id: "Z3B_VILLAS",
                    label: "Villas (22 units)",
                    level: "L3",
                    type: "category",
                    meterCount: 22,
                    children: [
                        { id: "4300094", label: "Z3-1", level: "L3", type: "Residential_Villa" },
                        { id: "4300098", label: "Z3-2", level: "L3", type: "Residential_Villa" },
                        { id: "4300088", label: "Z3-3", level: "L3", type: "Residential_Villa" },
                        { id: "4300078", label: "Z3-4", level: "L3", type: "Residential_Villa" },
                        { id: "4300104", label: "Z3-5", level: "L3", type: "Residential_Villa" },
                        { id: "4300100", label: "Z3-6", level: "L3", type: "Residential_Villa" },
                        { id: "4300090", label: "Z3-7", level: "L3", type: "Residential_Villa" },
                        { id: "4300105", label: "Z3-8", level: "L3", type: "Residential_Villa" },
                        { id: "4300096", label: "Z3-9", level: "L3", type: "Residential_Villa" },
                        { id: "4300092", label: "Z3-10", level: "L3", type: "Residential_Villa" },
                        { id: "4300077", label: "Z3-11", level: "L3", type: "Residential_Villa" },
                        { id: "4300076", label: "Z3-12", level: "L3", type: "Residential_Villa" },
                        { id: "4300025", label: "Z3-13", level: "L3", type: "Residential_Villa" },
                        { id: "4300060", label: "Z3-14", level: "L3", type: "Residential_Villa" },
                        { id: "4300057", label: "Z3-15", level: "L3", type: "Residential_Villa" },
                        { id: "4300103", label: "Z3-16", level: "L3", type: "Residential_Villa" },
                        { id: "4300080", label: "Z3-17", level: "L3", type: "Residential_Villa" },
                        { id: "4300083", label: "Z3-18", level: "L3", type: "Residential_Villa" },
                        { id: "4300099", label: "Z3-19", level: "L3", type: "Residential_Villa" },
                        { id: "4300020", label: "Z3-20", level: "L3", type: "Residential_Villa" },
                        { id: "4300009", label: "Z3-21", level: "L3", type: "Residential_Villa" },
                        { id: "4300102", label: "Z3-22", level: "L3", type: "Residential_Villa" },
                    ]
                },
                {
                    id: "Z3B_BLDGS",
                    label: "Buildings (11 units)",
                    level: "L3",
                    type: "category",
                    meterCount: 124,
                    children: [
                        {
                            id: "4300186", label: "D-52 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300008", label: "D-52 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300029", label: "D-52 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300042", label: "D-52 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300056", label: "D-52 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300069", label: "D-52 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300116", label: "D-52 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300126", label: "D-52 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300311", label: "D-53 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300064", label: "D-53 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300074", label: "D-53 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300201", label: "D-53 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300210", label: "D-53 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300211", label: "D-53 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300212", label: "D-53 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300213", label: "D-53 Apt 7", level: "L4", type: "Apartment" },
                                { id: "4300214", label: "D-53 Apt 8", level: "L4", type: "Apartment" },
                                { id: "4300215", label: "D-53 Apt 9", level: "L4", type: "Apartment" },
                                { id: "4300216", label: "D-53 Apt 10", level: "L4", type: "Apartment" },
                                { id: "4300217", label: "D-53 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300312", label: "D-54 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300202", label: "D-54 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300218", label: "D-54 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300219", label: "D-54 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300220", label: "D-54 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300221", label: "D-54 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300222", label: "D-54 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300223", label: "D-54 Apt 7", level: "L4", type: "Apartment" },
                                { id: "4300224", label: "D-54 Apt 8", level: "L4", type: "Apartment" },
                                { id: "4300225", label: "D-54 Apt 9", level: "L4", type: "Apartment" },
                                { id: "4300226", label: "D-54 Apt 10", level: "L4", type: "Apartment" },
                                { id: "4300227", label: "D-54 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300313", label: "D-55 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300071", label: "D-55 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300203", label: "D-55 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300228", label: "D-55 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300229", label: "D-55 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300230", label: "D-55 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300231", label: "D-55 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300232", label: "D-55 Apt 7", level: "L4", type: "Apartment" },
                                { id: "4300233", label: "D-55 Apt 8", level: "L4", type: "Apartment" },
                                { id: "4300234", label: "D-55 Apt 9", level: "L4", type: "Apartment" },
                                { id: "4300235", label: "D-55 Apt 10", level: "L4", type: "Apartment" },
                                { id: "4300236", label: "D-55 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300314", label: "D-56 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300204", label: "D-56 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300237", label: "D-56 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300238", label: "D-56 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300239", label: "D-56 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300240", label: "D-56 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300241", label: "D-56 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300242", label: "D-56 Apt 7", level: "L4", type: "Apartment" },
                                { id: "4300243", label: "D-56 Apt 8", level: "L4", type: "Apartment" },
                                { id: "4300244", label: "D-56 Apt 9", level: "L4", type: "Apartment" },
                                { id: "4300245", label: "D-56 Apt 10", level: "L4", type: "Apartment" },
                                { id: "4300246", label: "D-56 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300315", label: "D-57 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300205", label: "D-57 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300247", label: "D-57 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300248", label: "D-57 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300249", label: "D-57 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300250", label: "D-57 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300251", label: "D-57 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300252", label: "D-57 Apt 7", level: "L4", type: "Apartment" },
                                { id: "4300253", label: "D-57 Apt 8", level: "L4", type: "Apartment" },
                                { id: "4300254", label: "D-57 Apt 9", level: "L4", type: "Apartment" },
                                { id: "4300255", label: "D-57 Apt 10", level: "L4", type: "Apartment" },
                                { id: "4300256", label: "D-57 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300316", label: "D-58 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300070", label: "D-58 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300120", label: "D-58 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300130", label: "D-58 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300132", label: "D-58 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300206", label: "D-58 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300257", label: "D-58 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300258", label: "D-58 Apt 7", level: "L4", type: "Apartment" },
                                { id: "4300259", label: "D-58 Apt 8", level: "L4", type: "Apartment" },
                                { id: "4300260", label: "D-58 Apt 9", level: "L4", type: "Apartment" },
                                { id: "4300261", label: "D-58 Apt 10", level: "L4", type: "Apartment" },
                                { id: "4300262", label: "D-58 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300317", label: "D-59 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300066", label: "D-59 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300073", label: "D-59 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300207", label: "D-59 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300263", label: "D-59 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300264", label: "D-59 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300265", label: "D-59 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300266", label: "D-59 Apt 7", level: "L4", type: "Apartment" },
                                { id: "4300267", label: "D-59 Apt 8", level: "L4", type: "Apartment" },
                                { id: "4300268", label: "D-59 Apt 9", level: "L4", type: "Apartment" },
                                { id: "4300269", label: "D-59 Apt 10", level: "L4", type: "Apartment" },
                                { id: "4300270", label: "D-59 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300318", label: "D-60 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300065", label: "D-60 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300067", label: "D-60 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300068", label: "D-60 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300072", label: "D-60 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300208", label: "D-60 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300271", label: "D-60 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300272", label: "D-60 Apt 7", level: "L4", type: "Apartment" },
                                { id: "4300273", label: "D-60 Apt 8", level: "L4", type: "Apartment" },
                                { id: "4300274", label: "D-60 Apt 9", level: "L4", type: "Apartment" },
                                { id: "4300275", label: "D-60 Apt 10", level: "L4", type: "Apartment" },
                                { id: "4300276", label: "D-60 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300319", label: "D-61 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300209", label: "D-61 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300277", label: "D-61 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300278", label: "D-61 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300279", label: "D-61 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300280", label: "D-61 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300281", label: "D-61 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300282", label: "D-61 Apt 7", level: "L4", type: "Apartment" },
                                { id: "4300283", label: "D-61 Apt 8", level: "L4", type: "Apartment" },
                                { id: "4300284", label: "D-61 Apt 9", level: "L4", type: "Apartment" },
                                { id: "4300285", label: "D-61 Apt 10", level: "L4", type: "Apartment" },
                                { id: "4300286", label: "D-61 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                        {
                            id: "4300187", label: "D-62 Building Bulk", level: "L3", type: "D_Building_Bulk",
                            children: [
                                { id: "4300054", label: "D-62 Apt 1", level: "L4", type: "Apartment" },
                                { id: "4300062", label: "D-62 Apt 2", level: "L4", type: "Apartment" },
                                { id: "4300119", label: "D-62 Apt 3", level: "L4", type: "Apartment" },
                                { id: "4300124", label: "D-62 Apt 4", level: "L4", type: "Apartment" },
                                { id: "4300129", label: "D-62 Apt 5", level: "L4", type: "Apartment" },
                                { id: "4300133", label: "D-62 Apt 6", level: "L4", type: "Apartment" },
                                { id: "4300142", label: "D-62 Common", level: "L4", type: "Common_Area" },
                            ]
                        },
                    ]
                },
                { id: "4300320", label: "Irrigation Tank 02 (Z03)", level: "L3", type: "IRR_Services" }
            ]
        },
        {
            id: "4300345", label: "Zone 5", level: "L2", type: "Zone_Bulk", zone: "Zone_05",
            alert: true, note: "Monitor for losses", meterCount: 34,
            children: [
                {
                    id: "Z5_VILLAS", label: "Villas (33 units)", level: "L3", type: "category", meterCount: 33,
                    children: Array.from({ length: 33 }, (_, i) => ({ id: `430017${i}`, label: `Z5-${i + 1}`, level: "L3", type: "Residential_Villa" }))
                },
                { id: "4300321", label: "Irrigation Tank 03 (Z05)", level: "L3", type: "IRR_Services" }
            ]
        },
        {
            id: "4300342", label: "Zone 8", level: "L2", type: "Zone_Bulk", zone: "Zone_08", meterCount: 22,
            children: Array.from({ length: 22 }, (_, i) => ({ id: `430019${i}`, label: `Z8-${i + 1}`, level: "L3", type: "Residential_Villa" }))
        },
        {
            id: "4300335", label: "Village Square", level: "L2", type: "Zone_Bulk", zone: "Zone_VS", meterCount: 7,
            children: [
                { id: "4300327", label: "Coffee 1", level: "L3", type: "Retail" },
                { id: "4300329", label: "Coffee 2", level: "L3", type: "Retail" },
                { id: "4300330", label: "Supermarket", level: "L3", type: "Retail" },
                { id: "4300331", label: "Pharmacy", level: "L3", type: "Retail" },
                { id: "4300332", label: "Laundry", level: "L3", type: "Retail" },
                { id: "4300333", label: "Shop 593A", level: "L3", type: "Retail" },
                { id: "4300326", label: "Irrigation Tank VS", level: "L3", type: "IRR_Services" },
            ]
        },
        {
            id: "4300295", label: "Sales Center", level: "L2", type: "Zone_Bulk", zone: "Zone_SC",
            alert: true, note: "Known problem area", meterCount: 1,
            children: [{ id: "4300328", label: "Sale Centre Caffe", level: "L3", type: "Retail" }]
        }
    ]
};

interface NetworkNode {
    id: string;
    label: string;
    level: string;
    type: string;
    meterCount?: number;
    zone?: string;
    alert?: boolean;
    note?: string;
    children?: NetworkNode[];
}

const getIcon = (type: string, level: string) => {
    if (level === 'L1') return Droplets;
    if (type === 'category') return Filter;
    if (type === 'Zone_Bulk') return Gauge;
    if (type === 'Residential_Villa') return Home;
    if (type === 'D_Building_Bulk') return Building2;
    if (type === 'Apartment') return DoorOpen;
    if (type === 'Common_Area') return Users;
    if (type === 'Retail') return Store;
    if (type === 'IRR_Services') return Leaf;
    return Building2;
};

const getLevelStyle = (level: string, type: string) => {
    if (type === 'Common_Area') return { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', badge: 'bg-amber-500' };
    switch (level) {
        case 'L1': return { bg: 'bg-gradient-to-r from-emerald-500 to-teal-500', text: 'text-white', badge: 'bg-emerald-600' };
        case 'L2': return { bg: 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20', text: 'text-indigo-700 dark:text-indigo-300', badge: 'bg-indigo-500' };
        case 'L3': return { bg: 'bg-slate-50 dark:bg-slate-800/50', text: 'text-slate-700 dark:text-slate-300', badge: 'bg-slate-500' };
        case 'L4': return { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', badge: 'bg-purple-500' };
        default: return { bg: 'bg-white dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', badge: 'bg-slate-400' };
    }
};

interface TreeNodeProps {
    node: NetworkNode;
    depth?: number;
    searchTerm: string;
    expandedNodes: Set<string>;
    toggleExpand: (nodeId: string) => void;
}

const TreeNode = ({ node, depth = 0, searchTerm, expandedNodes, toggleExpand }: TreeNodeProps) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const Icon = getIcon(node.type, node.level);
    const levelStyle = getLevelStyle(node.level, node.type);
    const matchesSearch = searchTerm && node.label.toLowerCase().includes(searchTerm.toLowerCase());

    const childMatches = useMemo(() => {
        if (!searchTerm) return true;
        const checkMatch = (n: NetworkNode): boolean => {
            if (n.label.toLowerCase().includes(searchTerm.toLowerCase())) return true;
            if (n.children) return n.children.some(checkMatch);
            return false;
        };
        return checkMatch(node);
    }, [node, searchTerm]);

    if (searchTerm && !childMatches) return null;

    return (
        <div className="select-none">
            <div
                className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200
          ${depth === 0 ? levelStyle.bg : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}
          ${matchesSearch ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-900/30' : ''}
          ${node.alert ? 'border-l-4 border-red-400' : ''}
          ${node.level === 'L4' ? 'py-1.5' : ''}`}
                style={{ marginLeft: depth * 20 }}
                onClick={() => hasChildren && toggleExpand(node.id)}
            >
                <div className="w-5 h-5 flex items-center justify-center">
                    {hasChildren ? (isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />) : <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />}
                </div>
                <div className={`${node.level === 'L4' ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg flex items-center justify-center ${depth === 0 ? 'bg-white/20' : node.type === 'Common_Area' ? 'bg-amber-100 dark:bg-amber-800/30' : node.level === 'L4' ? 'bg-purple-100 dark:bg-purple-800/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <Icon className={`${node.level === 'L4' ? 'w-3 h-3' : 'w-4 h-4'} ${depth === 0 ? 'text-white' : node.type === 'Common_Area' ? 'text-amber-600 dark:text-amber-400' : levelStyle.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className={`font-medium truncate ${depth === 0 ? 'text-white text-lg' : node.level === 'L4' ? 'text-sm' : ''} ${levelStyle.text}`}>{node.label}</span>
                        {node.alert && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                    </div>
                    {node.note && <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{node.note}</p>}
                </div>
                <div className="flex items-center gap-2">
                    {node.level && node.type !== 'category' && <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${levelStyle.badge}`}>{node.level}</span>}
                    {node.type === 'D_Building_Bulk' && node.children && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-800/50 text-purple-600 dark:text-purple-300">{node.children.length} L4</span>}
                    {node.meterCount && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{node.meterCount} meters</span>}
                </div>
            </div>
            {hasChildren && isExpanded && (
                <div className="mt-1">{node.children?.map(child => <TreeNode key={child.id} node={child} depth={depth + 1} searchTerm={searchTerm} expandedNodes={expandedNodes} toggleExpand={toggleExpand} />)}</div>
            )}
        </div>
    );
};

const SummaryStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {[
            { label: 'L1 - Main Source', count: 1, color: 'bg-emerald-500', icon: Droplets },
            { label: 'L2 - Zone Bulks', count: 8, color: 'bg-indigo-500', icon: Gauge },
            { label: 'L2 - Direct', count: 11, color: 'bg-purple-500', icon: Building2 },
            { label: 'L3 - Bldg/Villa', count: 147, color: 'bg-sky-500', icon: Home },
            { label: 'L4 - Apartments', count: 183, color: 'bg-purple-400', icon: DoorOpen },
        ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}><stat.icon className="w-5 h-5 text-white" /></div>
                    <div><div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stat.count}</div><div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div></div>
                </div>
            </div>
        ))}
    </div>
);

const Legend = () => (
    <div className="flex flex-wrap gap-4 mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        {[
            { icon: Droplets, label: 'Main Source', color: 'text-emerald-500' },
            { icon: Gauge, label: 'Zone Bulk', color: 'text-indigo-500' },
            { icon: Home, label: 'Villa', color: 'text-sky-500' },
            { icon: Building2, label: 'Building Bulk (L3)', color: 'text-purple-500' },
            { icon: DoorOpen, label: 'Apartment (L4)', color: 'text-purple-400' },
            { icon: Users, label: 'Common Area (L4)', color: 'text-amber-500' },
            { icon: Store, label: 'Retail', color: 'text-orange-500' },
            { icon: Leaf, label: 'Irrigation', color: 'text-green-500' },
        ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5"><item.icon className={`w-4 h-4 ${item.color}`} /><span className="text-xs text-slate-600 dark:text-slate-400">{item.label}</span></div>
        ))}
        <div className="flex items-center gap-1.5 ml-auto"><div className="w-3 h-3 border-l-4 border-red-400 rounded-sm" /><span className="text-xs text-slate-600 dark:text-slate-400">Alert Zone</span></div>
    </div>
);

export function WaterNetworkHierarchy() {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['C43659', 'DC']));

    const toggleExpand = (nodeId: string) => setExpandedNodes(prev => { const next = new Set(prev); next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId); return next; });
    const expandAll = () => {
        const getAllIds = (n: NetworkNode): string[] => [n.id, ...(n.children?.flatMap(getAllIds) || [])];
        setExpandedNodes(new Set(getAllIds(networkData)));
    };
    const collapseAll = () => setExpandedNodes(new Set(['C43659']));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header with Search and Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <Droplets className="w-5 h-5 text-white" />
                        </div>
                        Water Network Hierarchy
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Muscat Bay • 349 Meters • 4-Level Structure (L1→L2→L3→L4)</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search meters..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full sm:w-64"
                        />
                    </div>
                    <button onClick={expandAll} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Expand All</button>
                    <button onClick={collapseAll} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Collapse</button>
                </div>
            </div>

            {/* Summary Stats */}
            <SummaryStats />

            {/* Building Hierarchy Info */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-indigo-500 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-indigo-800 dark:text-indigo-300">Building Hierarchy</h3>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1"><strong>L3 Building Bulk</strong> meters are parents of <strong>L4 Apartment + Common Area</strong> meters</p>
                        <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">Stage 3 Loss = Building Bulk (L3) − Sum(Apartments + Common Area in L4)</p>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <Legend />

            {/* Tree View */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
                <TreeNode node={networkData} searchTerm={searchTerm} expandedNodes={expandedNodes} toggleExpand={toggleExpand} />
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-slate-400 dark:text-slate-500">Muscat Bay Water Management System • v2.1 • Building→Apartment Hierarchy</div>
        </div>
    );
}

export default WaterNetworkHierarchy;
