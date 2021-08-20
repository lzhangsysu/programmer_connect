import React from 'react';
import PropTypes from 'prop-types';
import formatDate from '../../utils/formatDate';

const ProfileEducation = ({
    education: {
        school,
        degree,
        fieldofstudy,
        current,
        to,
        from,
        description
    }
}) => {
    return (
        <div>
            <h3 className='text-dark'>{school}</h3>
            <p>
                {formatDate(from)} - {!current ? formatDate(to) : 'Present' }
            </p>
            <p>
                <strong>Degree: </strong> {degree}
            </p>
            <p>
                <strong>Field of Study: </strong> {fieldofstudy}
            </p>
            <p>
                <strong>Description: </strong> {description}
            </p>
        </div>
    )
}

ProfileEducation.propTypes = {
    experience: PropTypes.object.isRequired
};

export default ProfileEducation;
