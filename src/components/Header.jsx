import React, { Component } from 'react';

class Header extends Component {
    state = {}
    render() {
        return (
            <div className="container-fluid bg-light px-3 py-2 mb-4 border-bottom text-center">
                <div className="mt-1 mb-1">
                    <h3 className='mb-0'>UBC Course Matcher</h3>
                    <span className='small text-muted'>Skip the tedious timetable talk and quickly get to sit with your friends!</span>
                </div>
            </div>
        );
    }
}

export default Header;