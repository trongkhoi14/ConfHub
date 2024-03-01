import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Options from './Options'
import StarDropdown from './StarDropdown'

const AdvancedFilter = () => {
    return (
        <Row direction="horizontal" gap={3} className="w-100">
            <Col>
                <span className="fw-bold text-color-black">Rank</span>
                <Options label={"ranks"}/>
            </Col>
            <Col>
                <span className="fw-bold text-color-black">Field of research</span>
                <Options label={"fors"}  />
            </Col>
            <Col>
                <span className="fw-bold text-color-black">Source</span>
                <Options label={"sources"}  />
            </Col>
            <Col>
                <span className="fw-bold text-color-black">Acronym</span>
                <Options label={"acronyms"}  />
            </Col>
            <Col>
                <span className="fw-bold text-color-black">Rating</span>
                <StarDropdown label={'Rating'}  />
            </Col>
            <Col>
                <span className="fw-bold text-color-black">Type</span>
                <Options label={"types"}  />
            </Col>
            <Col>
                <span className="fw-bold text-color-black">Impact factor</span>
                <StarDropdown label={'impactfactor'}  />
            </Col>

        </Row>
    )
}

export default AdvancedFilter