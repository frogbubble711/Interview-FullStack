import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { Table, Header, Container, Dimmer, Loader, Button, Modal, Grid, Confirm } from 'semantic-ui-react';
import Pagination from 'components/Pagination';
import { entryListRequest } from '../redux/actions';
import { makeSelectEntryList, makeSelectEntryListLoading } from '../redux/selectors';
import { WEEKDAYS } from 'utils/constants.js';

class EntriesPage extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      deleteId: null,
      showDeleteConfirm: false,
      page: 1,
      pageSize: 10,
      scheduleModalShow: false,
      currentEntry: null,
      currentAppointment: null,
      bookedAppointment: new Array(100),
    };
  }

  componentWillMount() {
    this.props.entryList();
  }

  onChangePage = (page) => {
    this.setState({ page });
  }

  handleBook = (index) => {
    this.setState({ showDeleteConfirm: true, currentAppointment: index, });
  }

  handleModalOpen = (entry) => {
    this.setState({
      scheduleModalShow: true,
      currentEntry: entry,
    });
  }

  handleConfirm = () => {
    const { currentAppointment, bookedAppointment } = this.state;

    bookedAppointment[currentAppointment] = true;
    this.setState({ showDeleteConfirm: false, bookedAppointment });
  }

  handleCancel = () => this.setState({ showDeleteConfirm: false })

  renderEntries = (entries) => {
    const { page, pageSize } = this.state;

    if (!entries.size) {
      return (
        <Table.Row>
          <Table.Cell colSpan="6">
            No Entries
          </Table.Cell>
        </Table.Row>
      );
    }

    return entries.slice((page - 1) * pageSize, page * pageSize).map((entry, index) => (
      <Table.Row key={index}>
        <Table.Cell>
          {entry.get('Name')}
        </Table.Cell>
        <Table.Cell>
          {entry.get('Timezone')}
        </Table.Cell>
        <Table.Cell>
          {entry.get('Day of Week')}
        </Table.Cell>
        <Table.Cell>
          {entry.get('Available at')}
        </Table.Cell>
        <Table.Cell>
          {entry.get('Available until')}
        </Table.Cell>
        <Table.Cell>
          <Button
            color="teal"
            size="mini"
            content="Schedule"
            onClick={() => this.handleModalOpen(entry)}
          />
        </Table.Cell>
      </Table.Row>
    ));
  }

  render() {
    const { entries, loading } = this.props;
    const { page, pageSize, scheduleModalShow, currentEntry, showDeleteConfirm, bookedAppointment } = this.state;
    const today = new Date();

    const availableEntires = entries.filter((entry) => {
      const utcOffset = moment().utcOffset(entry.get('Timezone').split(':').at(0).split('GMT').at(1)).utcOffset() / 60;
      const availableUntil = moment(entry.get('Available until'), ['hh:mm A']).add(utcOffset * -1, 'hours').format('HH');

      return moment(today).day() < WEEKDAYS.indexOf(entry.get('Day of Week')) + 1 && availableUntil >= today.getUTCHours()
    });

    const availableAt = currentEntry && moment(currentEntry.get('Available at'), ['hh:mm A']).valueOf();
    const availableUntil = currentEntry && moment(currentEntry.get('Available until'), ['hh:mm A']).valueOf();
    const scheduleAvailable = (availableUntil - availableAt) / 30 / 60 / 1000;

    return (
      <Container>
        <Confirm
          open={showDeleteConfirm}
          content="Are you sure to book this appointment?"
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />

        <Dimmer active={loading}>
          <Loader />
        </Dimmer>
        <Header as="h2" content="Entries" />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Timezone</Table.HeaderCell>
              <Table.HeaderCell>Day of Week</Table.HeaderCell>
              <Table.HeaderCell>Available at</Table.HeaderCell>
              <Table.HeaderCell>Available until</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.renderEntries(availableEntires)}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="6">
                <Pagination
                  total={availableEntires.size}
                  currentPage={page}
                  onChange={this.onChangePage}
                  perPage={pageSize}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>

        <Modal
          size="small"
          open={currentEntry && scheduleModalShow}
          onClose={() => this.setState({ scheduleModalShow: false, currentEntry: null })}
        >
          <Modal.Header>{ currentEntry && currentEntry.get('Name') } - { currentEntry && currentEntry.get('Day of Week') }</Modal.Header>
          <Modal.Content>
            <Grid>
              <Grid.Row columns={5}>
                {[...Array(scheduleAvailable)].map((x, index) =>
                  !bookedAppointment[index] && <Grid.Column key={index} className="schedules">
                    <Button
                      primary
                      size="tiny"
                      content={`${currentEntry && moment(currentEntry.get('Available at'), ['hh:mm A']).add(30 * index, 'minutes').format('HH:mm')} -
                                ${currentEntry && moment(currentEntry.get('Available at'), ['hh:mm A']).add(30 * ( index + 1 ), 'minutes').format('HH:mm')}`}
                      onClick={() => this.handleBook(index)}
                    />
                  </Grid.Column>
                )}
              </Grid.Row>
            </Grid>
          </Modal.Content>
        </Modal>
      </Container>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  entries: makeSelectEntryList(),
  loading: makeSelectEntryListLoading(),
});

const mapDispatchToProps = {
  entryList: entryListRequest,
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(EntriesPage);
