/*
 * Copyright (C) 2024 Yusef Rayyan
 *
 * This file is part of REISTO.
 *
 * REISTO is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * REISTO is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with REISTO. If not, see <https://www.gnu.org/licenses/>.
 */




import * as Yup from 'yup'

//#region UploadPostSchema
export const uploadPostSchema = (t) => Yup.object().shape({
    imageURL: Yup.string().required(t('screens.sharePost.schemaWarnings.image.required')),
    caption: Yup.string().max(1200, t('screens.sharePost.schemaWarnings.caption.maxWarning')).required(t('screens.sharePost.schemaWarnings.caption.required')),
    category: Yup.string().max(50, t('screens.sharePost.schemaWarnings.category.maxWarning')).required(t('screens.sharePost.schemaWarnings.category.required')),
    timeOfMake: Yup.string().max(2, t('screens.sharePost.schemaWarnings.timeOfMake.maxWarning')).required(t('screens.sharePost.schemaWarnings.timeOfMake.required')),
    captionIngredients: Yup.array()
        .of(Yup.string().trim().max(300, t('screens.sharePost.schemaWarnings.ingredients.maxWarning')))
        .test('at-least-one', t('screens.sharePost.schemaWarnings.ingredients.condition1'), function (value) {
            return value && value.some(ingredient => ingredient && ingredient.trim().length > 0);
        })
        .min(1, t('screens.sharePost.schemaWarnings.ingredients.condition2'))
        .max(10, t('screens.sharePost.schemaWarnings.ingredients.condition3'))
        .required(t('screens.sharePost.schemaWarnings.ingredients.required')),
    captionInstructions: Yup.array()
        .of(Yup.string().trim().max(300, t('screens.sharePost.schemaWarnings.instructions.maxWarning')))
        .test('at-least-one', t('screens.sharePost.schemaWarnings.instructions.maxWarning'), function (value) {
            return value && value.some(instruction => instruction && instruction.trim().length > 0);
        })
        .min(1, t('screens.sharePost.schemaWarnings.instructions.maxWarning'))
        .max(10, t('screens.sharePost.schemaWarnings.instructions.maxWarning'))
        .required(t('screens.sharePost.schemaWarnings.instructions.maxWarning')),
});

//#region SigninFormSchema
export const SinginFormSchema = Yup.object().shape({
    name: Yup.string()
        .matches(/^\S*$/, 'Username cannot contain spaces')
        .matches(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers')
        .required('Username is required').min(3, 'Username must be more than 3 letters'),
    email: Yup.string().email().required('An email is required'),
    password: Yup.string()
        .required('')
        .min(8, 'Password must be at least 8 characters')
        .test(
            'contains-letter',
            'Password must contain at least one letter',
            value => /[A-Za-z]/.test(value)
        )
        .test(
            'contains-number',
            'Password must contain at least one number',
            value => /\d/.test(value)
        )
        .test(
            'contains-special-character',
            'Password must contain at least one special character',
            value => /[@$!%*#?&-]/.test(value)
        ),
});

//#region EditProfileSchemas
export const uploadNameSchema = (t) => Yup.object().shape({
    DisplayedName: Yup.string().required(t('screens.profile.text.profileEdit.usernameSchemaWarning.required')).min(4, t('screens.profile.text.profileEdit.usernameSchemaWarning.minWarning')).max(15, t('screens.profile.text.profileEdit.usernameSchemaWarning.maxWarning'))
})

export const uploadBioSchema = (t) => Yup.object().shape({
    Bio: Yup.string().min(10, t('screens.profile.text.profileEdit.bioSchemaWarning.minWarning')).max(160, t('screens.profile.text.profileEdit.bioSchemaWarning.maxWarning'))
})

export const uploadLinkSchema = (t) => Yup.object().shape({
    Link: Yup.string().url(t('screens.profile.text.profileEdit.linkSchemaWarning.maxWarning'))
})