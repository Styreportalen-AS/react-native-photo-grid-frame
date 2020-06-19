/**
 * Created by Sivaraj Nagaraj
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, Dimensions, Modal, TouchableOpacity, StyleSheet, Text } from 'react-native';
import * as _ from 'lodash';

class PhotoGrid extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            photoUrl: '',
        };

    }

    photoPopupToggle(item, index) {
        if (this.props.onPressItem) {
            this.props.onPressItem(index);
        } else {
            this.setState({ modalVisible: !this.state.modalVisible, photoUrl: item && item.url });
        }
    }

    renderChunk() {
        let chunk = _.chunk(this.props.PhotosList, 9);
        if(this.props.previewMode) {
            let chunk = _.chunk(this.props.PhotosList, 3);
            for(const chunkItem of chunk) {
                let row = _.chunk(chunkItem, 3);
                return row.map(
                    (rowItem, rowIndex) => {

                        return this.renderPhotoRow(rowItem, rowIndex, 0 * 9 + rowIndex * 3);
                    }
                )
            }

        }
        return chunk.map(
            (chunkItem, index) => {
                let row = _.chunk(chunkItem, 3);

                return row.map(
                    (rowItem, rowIndex) => {

                        return this.renderPhotoRow(rowItem, rowIndex, index * 9 + rowIndex * 3);
                    }
                )

            }
        )


    }

    renderItem(item, index, expanded) {
        const { children, imageProps, ImageComponent } = this.props;
        if(this.props.previewMode && index === 2){
            return (
                <View ref={`_${index}`} key={index} style={[expanded ? styles.expandedView : styles.photoView, { borderRadius: this.props.borderRadius }]}>
                    <TouchableOpacity onPress={() => { this.photoPopupToggle(item, index) }}>
                        <ImageComponent
                            source={{ uri: item.url }}
                            {...imageProps}
                            style={[
                                imageProps && imageProps.style,
                                styles.ImageStyle,
                                ...(expanded ? [styles.expandedImage] : []),
                                { borderRadius: this.props.borderRadius }
                            ]}
                        />
                        {children && children(item)}
                    </TouchableOpacity>
                    <View style={[styles.overlay,  {borderRadius: this.props.borderRadius}]} >
                        <View style={{ alignSelf: 'stretch', alignContent: 'center', justifyContent:'center', height: '100%'}}>
                            <Text allowFontScaling={true} adjustsFontSizeToFit={true} style={[{color: 'white', alignSelf: 'center', fontSize: 50}]}>+ {this.props.PhotosList.length - 3}</Text>
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <View ref={`_${index}`} key={index} style={[expanded ? styles.expandedView : styles.photoView, { borderRadius: this.props.borderRadius }]}>
                    <TouchableOpacity onPress={() => { this.photoPopupToggle(item, index) }}>
                        <ImageComponent
                            source={{ uri: item.url }}
                            {...imageProps}
                            style={[
                                imageProps && imageProps.style,
                                styles.ImageStyle,
                                ...(expanded ? [styles.expandedImage] : []),
                                { borderRadius: this.props.borderRadius }
                            ]}
                        />
                        {children && children(item)}
                    </TouchableOpacity>
                </View>
            );
        }
    }

    renderPhotoRow(rowItem, rowIndex, index) {

        if (rowIndex == 0) {
            return this.renderPhotoRow1(rowItem, index);
        }
        else if (rowIndex == 1) {
            return this.renderPhotoRow2(rowItem, index);
        }
        else if (rowIndex == 2) {
            return this.renderPhotoRow3(rowItem, index);
        }

    }
    renderPhotoRow1(row, index) {
        return (
            <View key={index} style={styles.alignCenter}>
                {
                    row.map(
                        (item, i) => {
                            return this.renderItem(item, index + i, false);
                        }

                    )
                }

            </View>
        )
    }
    renderPhotoRow2(row, index) {
        if (row.length == 1) {
            return (
                <View key={index} style={styles.alignCenter}>
                    {this.renderItem(row[0], index, true)}
                </View>
            )
        }
        else if (row.length == 2) {
            return (
                <View key={index} style={styles.alignCenter}>
                    {this.renderItem(row[0], index, true)}
                    <View key={index + 1} style={styles.flexCol}>
                        {this.renderItem(row[1], index + 1, false)}
                    </View>
                </View>
            )

        }
        else if (row.length == 3) {
            return (
                <View key={index} style={styles.alignCenter}>
                    {this.renderItem(row[0], index, true)}
                    <View key={index + 1} style={styles.flexCol}>
                        {this.renderItem(row[1], index + 1, false)}
                        {this.renderItem(row[2], index + 2, false)}
                    </View>
                </View>
            )

        }

    }
    renderPhotoRow3(row, index) {
        if (row.length == 1) {
            return (
                <View key={index} style={styles.alignCenter}>
                    <View key={index} style={styles.flexCol}>
                        {this.renderItem(row[0], index, false)}
                    </View>
                </View>
            )
        }
        else if (row.length == 2) {
            return (
                <View key={index} style={styles.alignCenter}>
                    <View key={index} style={styles.flexCol}>
                        {this.renderItem(row[0], index, false)}
                        {this.renderItem(row[1], index + 1, false)}
                    </View>
                </View>
            )

        }
        else if (row.length == 3) {
            return (
                <View key={index} style={styles.alignCenter}>

                    <View style={styles.flexCol}>
                        {this.renderItem(row[0], index, false)}
                        {this.renderItem(row[1], index + 1, false)}
                    </View>
                    {this.renderItem(row[2], index + 2, true)}
                </View>
            )

        }

    }

    renderGrid() {
        return (
            <View>
                {this.renderChunk()}
            </View>
        )
    }

    render() {

        return (
            <View style={[styles.container]}>
                {this.renderGrid()}

                <View >
                    <Modal
                        animationType={"fade"}
                        transparent={false}
                        onRequestClose={() => { }}
                        visible={this.state.modalVisible}>

                        <TouchableOpacity onPress={() => { this.photoPopupToggle() }}>
                            <Image
                                source={{ uri: this.state.photoUrl }}
                                onPress={() => { this.photoPopupToggle() }}
                                style={{
                                    width: Dimensions.get('window').width,
                                    height: Dimensions.get('window').height,
                                    resizeMode: 'contain',
                                    alignSelf: 'center',
                                }} />
                        </TouchableOpacity>

                    </Modal>
                </View>

            </View>


        )
    }

}

/*Styles*/

const styles = {

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ImageStyle: {
        width: View.width,
        height: 120,
        resizeMode: 'cover'
    },

    flexCol: {
        flexDirection: 'column',
        flex: 1
    },
    alignCenter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width - 20,
        paddingRight: 5
    },

    photoView: {
        height: 120,
        flex: 2,
        backgroundColor: 'gray',
        marginHorizontal: 5,
        marginVertical: 5,
        justifyContent: 'center'
    },
    expandedView: {
        height: 249,
        backgroundColor: 'gray',
        marginHorizontal: 5,
        marginVertical: 5,
        flex: 2
    },
    expandedImage: {
        height: 249,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)'
    }
}

PhotoGrid.propTypes = {
    PhotosList: PropTypes.array,
    borderRadius: PropTypes.number,
    children: PropTypes.func,
    imageProps: PropTypes.object,
    onPressItem: PropTypes.func,
    ImageComponent: PropTypes.elementType,
    previewMode: PropTypes.bool
};

PhotoGrid.defaultProps = {
    ImageComponent: Image,
    previewMode: false
};

export { PhotoGrid };
